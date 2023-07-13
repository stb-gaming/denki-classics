const { app, BrowserWindow, ipcMain } = require('electron');
const { downloadFile } = require("./download");
const { fileReadable } = require("./utils");

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

	win.loadFile('menu/index.html');

	return win;
};

app.whenReady().then(async () => {
	app.userDataPath = app.getPath("userData");
	app.settingsPath = path.join(app.userDataPath, "settings.json");
	app.gamesYaml = path.join(app.userDataPath, "games.yml");

	if (fileReadable(app.gamesYaml)) {
		console.log(`games.yml exists in ${app.userDataPath}: OK!`)
	} else {
		console.error(`games.yml doesn't exist yet - downloading to ${app.gamesYaml}`)
		await downloadFile("https://raw.githubusercontent.com/stb-gaming/sky-games/master/_data/games.yml", app.userDataPath);
	}

	Object.entries(require("./handlers")).forEach(([channel, func]) => {
		ipcMain.handle(channel, func);
	});
	app.mainWindow = createWindow();
});
