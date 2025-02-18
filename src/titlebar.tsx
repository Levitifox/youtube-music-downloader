import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import { Tooltip } from "./tooltip";

export function TitleBar() {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        ipcRenderer.on("window-maximized", () => setIsMaximized(true));
        ipcRenderer.on("window-restored", () => setIsMaximized(false));

        return () => {
            ipcRenderer.removeAllListeners("window-maximized");
            ipcRenderer.removeAllListeners("window-restored");
        };
    }, []);

    const handleMinimize = () => {
        ipcRenderer.send("window-minimize");
    };

    const handleMaximizeRestore = () => {
        ipcRenderer.send(isMaximized ? "window-restore" : "window-maximize");
    };

    const handleClose = () => {
        ipcRenderer.send("window-close");
    };

    const handleAbout = () => {
        ipcRenderer.send("open-about-panel");
    };

    return (
        <div className="titlebar">
            <div className="title-container">
                <div className="title">Youtube Music Downloader</div>
                <Tooltip text="About" placement="bottom" arrowAlignment="center">
                    <button onClick={handleAbout} className="titlebar-button about-button">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6 7.8C6 8.24184 6.4477 8.6 7 8.6V12.4C6.4477 12.4 6 12.7582 6 13.2C6 13.6418 6.4477 14 7 14H9C9.5523 14 10 13.6418 10 13.2C10 12.7582 9.5523 12.4 9 12.4V7H7C6.4477 7 6 7.35818 6 7.8Z"
                                fill="#F1F1F1"
                            />
                            <path
                                d="M7.99984 5.66667C8.73619 5.66667 9.33317 5.06972 9.33317 4.33333C9.33317 3.59695 8.73619 3 7.99984 3C7.26348 3 6.6665 3.59695 6.6665 4.33333C6.6665 5.06972 7.26348 5.66667 7.99984 5.66667Z"
                                fill="#F1F1F1"
                            />
                        </svg>
                    </button>
                </Tooltip>
            </div>
            <div className="controls">
                <Tooltip text="Minimize" placement="bottom" arrowAlignment="center">
                    <button onClick={handleMinimize} className="titlebar-button">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.5 9C4.22386 9 4 9.22386 4 9.5V9.5C4 9.77614 4.22386 10 4.5 10H11.5C11.7761 10 12 9.77614 12 9.5V9.5C12 9.22386 11.7761 9 11.5 9H4.5Z"
                                fill="#808080"
                            />
                        </svg>
                    </button>
                </Tooltip>
                <Tooltip text={isMaximized ? "Restore" : "Maximize"} placement="bottom" arrowAlignment="center">
                    <button onClick={handleMaximizeRestore} className="titlebar-button">
                        {isMaximized ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5.6 6C5.03995 6 4.75992 6 4.54601 6.10899C4.35785 6.20487 4.20487 6.35785 4.10899 6.54601C4 6.75992 4 7.03995 4 7.6V10.4C4 10.9601 4 11.2401 4.10899 11.454C4.20487 11.6422 4.35785 11.7951 4.54601 11.891C4.75992 12 5.03995 12 5.6 12H8.4C8.96005 12 9.24008 12 9.45399 11.891C9.64215 11.7951 9.79513 11.6422 9.89101 11.454C10 11.2401 10 10.9601 10 10.4V7.6C10 7.03995 10 6.75992 9.89101 6.54601C9.79513 6.35785 9.64215 6.20487 9.45399 6.10899C9.24008 6 8.96005 6 8.4 6H5.6ZM5 8.6C5 8.03995 5 7.75992 5.10899 7.54601C5.20487 7.35785 5.35785 7.20487 5.54601 7.10899C5.75992 7 6.03995 7 6.6 7H7.4C7.96005 7 8.24008 7 8.45399 7.10899C8.64215 7.20487 8.79513 7.35785 8.89101 7.54601C9 7.75992 9 8.03995 9 8.6V9.4C9 9.96005 9 10.2401 8.89101 10.454C8.79513 10.6422 8.64215 10.7951 8.45399 10.891C8.24008 11 7.96005 11 7.4 11H6.6C6.03995 11 5.75992 11 5.54601 10.891C5.35785 10.7951 5.20487 10.6422 5.10899 10.454C5 10.2401 5 9.96005 5 9.4V8.6Z"
                                    fill="#808080"
                                />
                                <path
                                    opacity="0.5"
                                    d="M6.5 4C6.22386 4 6 4.22386 6 4.5V4.5C6 4.77614 6.22386 5 6.5 5H9.4C9.96005 5 10.2401 5 10.454 5.10899C10.6422 5.20487 10.7951 5.35785 10.891 5.54601C11 5.75992 11 6.03995 11 6.6V9.5C11 9.77614 11.2239 10 11.5 10V10C11.7761 10 12 9.77614 12 9.5V5.6C12 5.03995 12 4.75992 11.891 4.54601C11.7951 4.35785 11.6422 4.20487 11.454 4.10899C11.2401 4 10.9601 4 10.4 4H6.5Z"
                                    fill="#808080"
                                />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5.6 4C5.03995 4 4.75992 4 4.54601 4.10899C4.35785 4.20487 4.20487 4.35785 4.10899 4.54601C4 4.75992 4 5.03995 4 5.6V10.4C4 10.9601 4 11.2401 4.10899 11.454C4.20487 11.6422 4.35785 11.7951 4.54601 11.891C4.75992 12 5.03995 12 5.6 12H10.4C10.9601 12 11.2401 12 11.454 11.891C11.6422 11.7951 11.7951 11.6422 11.891 11.454C12 11.2401 12 10.9601 12 10.4V5.6C12 5.03995 12 4.75992 11.891 4.54601C11.7951 4.35785 11.6422 4.20487 11.454 4.10899C11.2401 4 10.9601 4 10.4 4H5.6ZM5 6.6C5 6.03995 5 5.75992 5.10899 5.54601C5.20487 5.35785 5.35785 5.20487 5.54601 5.10899C5.75992 5 6.03995 5 6.6 5H9.4C9.96005 5 10.2401 5 10.454 5.10899C10.6422 5.20487 10.7951 5.35785 10.891 5.54601C11 5.75992 11 6.03995 11 6.6V9.4C11 9.96005 11 10.2401 10.891 10.454C10.7951 10.6422 10.6422 10.7951 10.454 10.891C10.2401 11 9.96005 11 9.4 11H6.6C6.03995 11 5.75992 11 5.54601 10.891C5.35785 10.7951 5.20487 10.6422 5.10899 10.454C5 10.2401 5 9.96005 5 9.4V6.6Z"
                                    fill="#808080"
                                />
                            </svg>
                        )}
                    </button>
                </Tooltip>
                <Tooltip text="Close" placement="bottom" arrowAlignment="right">
                    <button onClick={handleClose} className="titlebar-button close-button">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.14647 4.1465C3.95124 4.34173 3.95124 4.65827 4.14647 4.8535L6.1616 6.86863C6.55762 7.26465 6.75562 7.46265 6.82981 7.69098C6.89507 7.89183 6.89507 8.10817 6.82981 8.30902C6.75562 8.53734 6.55761 8.73535 6.1616 9.13137L4.14647 11.1465C3.95124 11.3417 3.95124 11.6583 4.14647 11.8535V11.8535C4.3417 12.0487 4.65824 12.0487 4.85347 11.8535L6.8686 9.83837C7.26461 9.44235 7.46262 9.24434 7.69095 9.17016C7.89179 9.1049 8.10814 9.1049 8.30899 9.17016C8.53731 9.24434 8.73532 9.44235 9.13134 9.83837L11.1465 11.8535C11.3417 12.0487 11.6582 12.0487 11.8535 11.8535V11.8535C12.0487 11.6583 12.0487 11.3417 11.8535 11.1465L9.83834 9.13137C9.44232 8.73535 9.24431 8.53734 9.17013 8.30902C9.10487 8.10817 9.10487 7.89183 9.17013 7.69098C9.24431 7.46265 9.44232 7.26465 9.83834 6.86863L11.8535 4.8535C12.0487 4.65827 12.0487 4.34173 11.8535 4.1465V4.1465C11.6582 3.95127 11.3417 3.95127 11.1465 4.1465L9.13134 6.16163C8.73532 6.55765 8.53731 6.75565 8.30899 6.82984C8.10814 6.8951 7.89179 6.8951 7.69095 6.82984C7.46262 6.75565 7.26461 6.55765 6.8686 6.16163L4.85347 4.1465C4.65824 3.95127 4.3417 3.95127 4.14647 4.1465V4.1465Z"
                                fill="#808080"
                            />
                        </svg>
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}
