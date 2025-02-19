import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { spawn, ChildProcess } from "child_process";
import * as path from "path";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

let mainWindow: BrowserWindow;
let currentPythonProcess: ChildProcess | null = null;

app.setAboutPanelOptions({
    applicationName: "Youtube Music Downloader",
    applicationVersion: app.getVersion(),
    credits: "Developed by Levitifox",
});

ipcMain.handle("dialog:showOpenDialog", async (_event, options) => {
    return await dialog.showOpenDialog(options);
});

ipcMain.on("window-minimize", () => {
    mainWindow.minimize();
});

ipcMain.on("window-maximize", () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on("window-restore", () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    }
});

ipcMain.on("window-close", () => {
    mainWindow.close();
});

ipcMain.on("open-about-panel", () => {
    app.showAboutPanel();
});

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 650,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.on("maximize", () => {
        mainWindow.webContents.send("window-maximized");
    });

    mainWindow.on("unmaximize", () => {
        mainWindow.webContents.send("window-restored");
    });

    mainWindow.on("enter-full-screen", () => {
        mainWindow.webContents.send("window-maximized");
    });
    mainWindow.on("leave-full-screen", () => {
        mainWindow.webContents.send("window-restored");
    });

    mainWindow.loadFile("index.html");
});

ipcMain.on("download-link", (event, data) => {
    const { link, folder } = data;
    const scriptPath = path.join(__dirname, "download.py");

    currentPythonProcess = spawn("python", ["-u", scriptPath, link, folder]);

    currentPythonProcess.stdout?.on("data", data => {
        const message = data.toString();
        console.log(`Python stdout: ${message}`);
        mainWindow.webContents.send("download-console", message);
    });

    currentPythonProcess.stderr?.on("data", data => {
        const message = data.toString();
        console.error(`Python stderr: ${message}`);
        mainWindow.webContents.send("download-console", message);
    });

    currentPythonProcess.on("close", code => {
        console.log(`Python process exited with code ${code}`);
        mainWindow.webContents.send("download-complete", code);
        currentPythonProcess = null;
    });
});

ipcMain.on("cancel-download", event => {
    if (currentPythonProcess) {
        currentPythonProcess.kill();
        currentPythonProcess = null;
        event.reply("download-complete", -1);
    }
});

app.on("window-all-closed", () => {
    app.quit();
});
