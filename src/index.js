const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const createWindow = () => {
	const win = new BrowserWindow({
		frame: false,
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js")
		}
	});

	win.loadFile('../menu/index.html');

};

app.whenReady().then(() => {
	ipcMain.handle('getfolder', () => app.getPath("userData"));
	createWindow();
	console.log(app.getPath('userData'));
});
