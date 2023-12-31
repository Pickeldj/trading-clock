// Import required modules
const { app, BrowserWindow } = require('electron');
const AutoLaunch = require('auto-launch');

// Function to create the main window
function createWindow() {
  // Create a new browser window
  const win = new BrowserWindow({
    resizable: false, // Disable resizing
    frame: false, // Disable the window frame
    transparent: true, // Make the window transparent 
    width: 600,
    height: 40,
    useContentSize: true, // Use the content size for the window size
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true, // Enable remote module to access BrowserWindow instance
    }
  });

  // Load the index.html file into the window
  win.loadFile('index.html');

  // Make the window draggable
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      html, body {
        -webkit-app-region: drag; /* Enable dragging */
        user-select: none; /* Disable content selection */
      }
    `);
  });

  // Hide the menu bar
  win.setAutoHideMenuBar(true);

  // Hide the scrollbar in the window's web contents
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      ::-webkit-scrollbar {
        display: none; /* Hide the scrollbar */
      }
    `);
  });
}

// Create an instance of AutoLaunch to enable auto-launching the app on system startup
let autoLaunch = new AutoLaunch({
  name: 'TRADING-CLOCK',
  path: app.getPath('exe'),
});

// Check if auto-launch is enabled, if not, enable it
autoLaunch.isEnabled().then((isEnabled) => {
  if (!isEnabled) autoLaunch.enable();
});

// When the app is ready, create the main window
app.whenReady().then(createWindow);
