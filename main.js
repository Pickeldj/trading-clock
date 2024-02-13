// Import required modules
const { app, BrowserWindow } = require('electron');


// Function to create the main window
function createWindow() {
  // Create a new browser window
  const win = new BrowserWindow({
    resizable: false, // Disable resizing
    transparent: true, // Make the window transparent
    titleBarStyle: 'hidden', // Hide the title bar 
    width: 545,
    height: 41,
    useContentSize: false, // Use the content size for the window size
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true, // Enable remote module to access BrowserWindow instance
    }
  });

  // Load the index.html file into the window
  win.loadFile('index.html');

  // Make the window draggable and hide the scrollbar
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      html, body {
        -webkit-app-region: drag; /* Enable dragging */
        user-select: none; /* Disable content selection */
      }
      ::-webkit-scrollbar {
        display: none; /* Hide the scrollbar */
      }
    `);
  });

  // Hide the menu bar
  win.setAutoHideMenuBar(true);
}

// When the app is ready, create the main window
app.whenReady().then(createWindow);