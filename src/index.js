const { app, BrowserWindow, ipcMain } = require('electron');
const { downloadFile } = require("./download");
const { fileReadable } = require("./utils");

const fs = require("fs/promises");
const path = require('path');


const createWindow = () => {
	const win = new BrowserWindow({
		// frame: false,
		width: 850,
		height: 700,
		webPreferences: {
			preload: path.join(__dirname, "preload.js")
		}
	});

	win.menuBarVisible = 0;
	//win.maximize();

	win.loadFile('www/index.html');

	return win;
};


app.whenReady().then(async () => {
	app.userDataPath = app.getPath("userData");
	app.settingsPath = path.join(app.userDataPath, "settings.json");
	app.gamesYaml = path.join(app.userDataPath, "games.yml");

	if (!await fileReadable(app.settingsPath)) {
		await fs.writeFile(app.settingsPath, JSON.stringify(require("./defaults"), null, 2));
	}
	if (await fileReadable(app.gamesYaml)) {
		console.log(`games.yml exists in ${app.userDataPath}: OK!`);
	} else {
		console.error(`games.yml doesn't exist yet - downloading to ${app.gamesYaml}`);
		await downloadFile("https://raw.githubusercontent.com/stb-gaming/sky-games/master/_data/games.yml", app.userDataPath);
	}

	//todo: download the files in assets.js into userdata/assets/{css,js,userscripts}

	Object.entries(require("./handlers")).forEach(([channel, func]) => {
		ipcMain.handle(channel, func);
	});
	app.mainWindow = createWindow();
});
