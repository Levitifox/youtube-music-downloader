import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { createRoot } from "react-dom/client";
import { TitleBar } from "./titlebar";

const { ipcRenderer } = window.require("electron");

function App() {
    const [link, setLink] = useState("");
    const [folder, setFolder] = useState("");
    const [processing, setProcessing] = useState(false);
    const [completeMessage, setCompleteMessage] = useState("");
    const [errors, setErrors] = useState<{ link?: string; folder?: string }>({});
    const [consoleOutput, setConsoleOutput] = useState("");
    const [showConsole, setShowConsole] = useState(false);
    const outputRef = useRef<HTMLDivElement>(null);

    const validateInputs = () => {
        const newErrors: { link?: string; folder?: string } = {};
        if (!link.trim()) newErrors.link = "Enter a valid link.";
        if (!folder.trim()) newErrors.folder = "Select an output folder.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBrowse = async () => {
        const result = await ipcRenderer.invoke("dialog:showOpenDialog", {
            properties: ["openDirectory"],
        });
        if (!result.canceled && result.filePaths?.length) {
            setFolder(result.filePaths[0]);
        }
    };

    const handleProcess = () => {
        if (!validateInputs()) return;
        setCompleteMessage("");
        setConsoleOutput("");
        setProcessing(true);
        ipcRenderer.send("download-link", { link, folder });
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleProcess();
    };

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [consoleOutput]);

    useEffect(() => {
        const onConsole = (_: any, log: string) => {
            setConsoleOutput(prev => prev + log + "\n");
        };

        const onComplete = (_: any, code: number) => {
            setProcessing(false);
            const msg = code === 0 ? "Download complete!" : "Download failed.";
            setCompleteMessage(msg);
            onConsole(null, msg);
        };

        const onFailure = (_: any, data: { trackName: string; error: string }) => {
            onConsole(null, `Error in ${data.trackName}: ${data.error}`);
        };

        ipcRenderer.on("download-console", onConsole);
        ipcRenderer.on("download-complete", onComplete);
        ipcRenderer.on("download-failure", onFailure);

        return () => {
            ipcRenderer.removeListener("download-console", onConsole);
            ipcRenderer.removeListener("download-complete", onComplete);
            ipcRenderer.removeListener("download-failure", onFailure);
        };
    }, []);

    return (
        <div>
            <TitleBar />
            <div className="main-content">
                <div className="input-section">
                    <div className="link-input-container">
                        <input
                            type="text"
                            id="link-input"
                            placeholder="Enter YouTube/Music link"
                            value={link}
                            onChange={e => setLink(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={processing}
                        />
                        {errors.link && <div className="error-message">{errors.link}</div>}
                    </div>
                    <div className="folder-input-container">
                        <input type="text" id="folder-input" placeholder="Select output folder" value={folder} disabled={processing} />
                        <button onClick={handleBrowse} disabled={processing}>
                            Browse
                        </button>
                        {errors.folder && <div className="error-message">{errors.folder}</div>}
                    </div>
                </div>

                <div className="process-section">
                    <button onClick={handleProcess} disabled={processing}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="#ffffff"
                            style={{
                                width: "1.5em",
                                height: "1.5em",
                                marginRight: "8px",
                                marginLeft: "-5px",
                            }}
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3 14.25C3.41421 14.25 3.75 14.5858 3.75 15C3.75 16.4354 3.75159 17.4365 3.85315 18.1919C3.9518 18.9257 4.13225 19.3142 4.40901 19.591C4.68577 19.8678 5.07435 20.0482 5.80812 20.1469C6.56347 20.2484 7.56459 20.25 9 20.25H15C16.4354 20.25 17.4365 20.2484 18.1919 20.1469C18.9257 20.0482 19.3142 19.8678 19.591 19.591C19.8678 19.3142 20.0482 18.9257 20.1469 18.1919C20.2484 17.4365 20.25 16.4354 20.25 15C20.25 14.5858 20.5858 14.25 21 14.25C21.4142 14.25 21.75 14.5858 21.75 15V15.0549C21.75 16.4225 21.75 17.5248 21.6335 18.3918C21.5125 19.2919 21.2536 20.0497 20.6517 20.6516C20.0497 21.2536 19.2919 21.5125 18.3918 21.6335C17.5248 21.75 16.4225 21.75 15.0549 21.75H8.94513C7.57754 21.75 6.47522 21.75 5.60825 21.6335C4.70814 21.5125 3.95027 21.2536 3.34835 20.6517C2.74643 20.0497 2.48754 19.2919 2.36652 18.3918C2.24996 17.5248 2.24998 16.4225 2.25 15.0549C2.25 15.0366 2.25 15.0183 2.25 15C2.25 14.5858 2.58579 14.25 3 14.25Z"
                                fill="#ffffff"
                            ></path>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 16.75C12.2106 16.75 12.4114 16.6615 12.5535 16.5061L16.5535 12.1311C16.833 11.8254 16.8118 11.351 16.5061 11.0715C16.2004 10.792 15.726 10.8132 15.4465 11.1189L12.75 14.0682V3C12.75 2.58579 12.4142 2.25 12 2.25C11.5858 2.25 11.25 2.58579 11.25 3V14.0682L8.55353 11.1189C8.27403 10.8132 7.79963 10.792 7.49393 11.0715C7.18823 11.351 7.16698 11.8254 7.44648 12.1311L11.4465 16.5061C11.5886 16.6615 11.7894 16.75 12 16.75Z"
                                fill="#ffffff"
                            ></path>
                        </svg>
                        {processing ? "Processing..." : "Download"}
                    </button>
                </div>

                {completeMessage && <div className="complete-message">{completeMessage}</div>}

                <div className="console-output-section">
                    <button onClick={() => setShowConsole(!showConsole)} className={showConsole ? "hide-details" : "see-details"}>
                        {showConsole ? "Hide Details" : "See Details"}
                    </button>
                    {showConsole && (
                        <div className="console-output-window" ref={outputRef}>
                            <pre>{consoleOutput}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

document.addEventListener("DOMContentLoaded", () => {
    const root = createRoot(document.getElementById("app")!);
    root.render(<App />);
});
