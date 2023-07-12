const { app, BrowserWindow, ipcMain } = require('electron');
const { downloadFile } = require("./download");
const path = require('path');
const fs = require('fs/promises');

const createWindow = () => {
	const win = new BrowserWindow({
		// frame: false,
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js")
		}
	});

	win.loadFile('../menu/index.html');

};

const ipcHandlers = {
	'getFolder': () => app.userDataPath,
	'savesettings': async (event, settings) => {
		await fs.writeFile(app.settingsPath, JSON.stringify(settings, null, 2));
	},
	'loadsettings': async () => {
		const json = await fs.readFile(app.settingsPath);
		return JSON.parse(json);
	}
};

app.whenReady().then(async () => {
	app.userDataPath = app.getPath("userData")
	app.settingsPath = path.join(app.userDataPath, "settings.json")
	app.gamesYaml = path.join(app.userDataPath, "games.yml")

	try {
		await fs.access(app.gamesYaml, fs.constants.R_OK)
		console.log(`games.yml exists in ${app.userDataPath}: OK!`)
	} catch (err) {
		console.error(`games.yml doesn't exist in ${app.userDataPath}, downloading it now.`)
		downloadFile("https://raw.githubusercontent.com/stb-gaming/sky-games/master/_data/games.yml", app.userDataPath);
	}

	Object.entries(ipcHandlers).forEach(([channel, func]) => {
		ipcMain.handle(channel, func)
	})
	createWindow();
});
