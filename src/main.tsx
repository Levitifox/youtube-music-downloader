import React, { useState, useEffect, KeyboardEvent } from "react";
import { createRoot } from "react-dom/client";
import { TitleBar } from "./titlebar";
import Lottie from "lottie-react";
import downloadingAnimation from "./animations/downloading.json";
import completedAnimation from "./animations/completed.json";
import failedAnimation from "./animations/failed.json";

const { ipcRenderer } = window.require("electron");

interface FailedTrack {
    trackName: string;
    error: string;
}

function App() {
    const [link, setLink] = useState("");
    const [folder, setFolder] = useState("");
    const [processing, setProcessing] = useState(false);
    const [completeMessage, setCompleteMessage] = useState("");
    const [failedTracks, setFailedTracks] = useState<FailedTrack[]>([]);
    const [errors, setErrors] = useState<{ link?: string; folder?: string }>({});
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        if (processing) {
            setAnimationData(downloadingAnimation);
        } else if (!processing && completeMessage) {
            setAnimationData(completeMessage.toLowerCase().includes("complete") ? completedAnimation : failedAnimation);
        }
    }, [processing, completeMessage]);

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
        setFailedTracks([]);
        setProcessing(true);
        ipcRenderer.send("download-link", { link, folder });
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleProcess();
    };

    useEffect(() => {
        const onFailure = (_: any, data: FailedTrack) => setFailedTracks(prev => [...prev, data]);
        const onComplete = (_: any, code: number) => {
            setProcessing(false);
            setCompleteMessage(code === 0 ? "Download complete!" : "Download failed.");
        };

        ipcRenderer.on("download-failure", onFailure);
        ipcRenderer.on("download-complete", onComplete);

        return () => {
            ipcRenderer.removeListener("download-failure", onFailure);
            ipcRenderer.removeListener("download-complete", onComplete);
        };
    }, []);

    let animationClass = "";
    if (processing) {
        animationClass = "download-animation";
    } else if (completeMessage && completeMessage.toLowerCase().includes("complete")) {
        animationClass = "completed-animation";
    }

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
                        <input type="text" id="folder-input" placeholder="Select output folder" value={folder} readOnly disabled={processing} />
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
                            style={{ width: "1.5em", height: "1.5em", marginRight: "8px", marginLeft: "-5px" }}
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

                {failedTracks.length > 0 && (
                    <div className="error-table-section">
                        <table className="error-table">
                            <thead>
                                <tr>
                                    <th>Track Name</th>
                                    <th>Error</th>
                                </tr>
                            </thead>
                            <tbody>
                                {failedTracks.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.trackName}</td>
                                        <td>{item.error}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {animationData && (
                    <div className={`animation-container ${animationClass}`}>
                        <Lottie animationData={animationData} loop={processing} />
                    </div>
                )}
            </div>
        </div>
    );
}

document.addEventListener("DOMContentLoaded", () => {
    const root = createRoot(document.getElementById("app")!);
    root.render(<App />);
});
