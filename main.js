const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const url = require("url");
const path = require("path");
const fs = require("fs");

let loadingWindow = null;
let myWindow = null;
let windowCount = 0;

const configFilePath = "/tmp/plisystem_workstation_first_launch.json";

const logFile =
  "/home/orin/tuan/EVN/desktop_app/plisystem_workstation/plisystem_workstation_app.log";

function logToFile(message) {
  fs.appendFileSync(logFile, message + "\n");
}

function isFirstLaunch() {
  if (!fs.existsSync(configFilePath)) {
    return false;
  } else {
    return true;
  }
}
function createMainWindow() {
  const shouldQuit = !app.requestSingleInstanceLock();

  if (shouldQuit) {
    app.quit(); // Quit if another instance is already running
  } else {
    app.on("second-instance", () => {
      // Someone tried to start a second instance, focus our window.
      if (myWindow) {
        if (myWindow.isMinimized()) myWindow.restore();
        myWindow.focus();
      }
    });

    // const script = spawn("/usr/share/backend/run_uav_app.sh");

    // script.stdout.on("data", (data) => {
    //   console.log(`STDOUT: ${data}`);
    // });

    // script.stderr.on("data", (data) => {
    //   console.error(`STDERR: ${data}`);
    // });

    // script.on("close", (code) => {
    //   console.log(`child process exited with code ${code}`);
    // });

    // Create a temporary loading window
    loadingWindow = new BrowserWindow({
      width: 650, // Adjust width and height as needed
      height: 400,
      frame: false, // Remove window frame for a cleaner look
      show: false, // Don't show it initially
      alwaysOnTop: true, // Keep it on top of other windows,
      webPreferences: {
        sandbox: false,
      },
    });

    loadingWindow.loadFile("assets/loading.html"); // Load your loading page
    windowCount++;
    loadingWindow.show();

    setTimeout(() => {
      if (loadingWindow) {
        app.quit();
        windowCount--;
        loadingWindow = null;
      }

      const mainWindow = new BrowserWindow({
        title: "plisystem_workstation ",
        // titleBarStyle: "hidden", // Hide the title bar
        autoHideMenuBar: true, // Hide the menu bar only
        width: 1680,
        height: 920,
        webPreferences: {
          sandbox: false,
        },
      });
      mainWindow.show();

      // mainWindow.webContents.openDevTools();

      const startUrl = url.format({
        pathname: path.join(
          __dirname,
          "./plisystem_workstation_deploy/build/index.html"
        ),
        protocol: "file",
      });

      windowCount++;
      mainWindow.loadURL(startUrl);
    }, 15000);
  }
}

// run this as early in the main process as possible
if (require("electron-squirrel-startup")) app.quit();

app.commandLine.appendSwitch("--no-sandbox");
app.whenReady().then(() => {
  let firstLaunch = isFirstLaunch();
  console.log("firstLaunch: ", firstLaunch);
  if (!firstLaunch) {
    const script = spawn(
      "/home/orin/tuan/EVN/desktop_app/plisystem_workstation_app_experiment_21052025_latest_stable/run_uav_app.sh"
    );

    script.stdout.on("data", (data) => {
      console.log(`STDOUT: ${data}`);
      logToFile(`STDOUT: ${data}`);
    });

    script.stderr.on("data", (data) => {
      console.error(`STDERR: ${data}`);
      logToFile(`STDERR: ${data}`);
    });

    script.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      logToFile(`Process exited with code ${code}`);
    });
    console.log("Run .sh");
    logToFile("Run .sh");
    fs.writeFileSync(configFilePath, JSON.stringify({ firstLaunch: true }));
  } else {
    console.log("Has already launch");
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore();
      myWindow.focus();
    }
  }
  createMainWindow();
});

app.disableHardwareAcceleration();
app.on("will-quit", async (event) => {
  async function callApiBeforeQuit() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/killmultipleprocesses/"
      );
      const responseObject = await response.json();
      return responseObject;
    } catch (error) {
      console.error("API call failed:", error);
    }
  }

  windowCount--;
  console.log("windowCountFinal:", windowCount);
  // Call your API function before quitting
  if (windowCount == 0) {
    callApiBeforeQuit();
    fs.unlink(configFilePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully!");
      }
    });
  } else {
    console.log("Still have window opened");
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore();
      myWindow.focus();
    }
  }
});
