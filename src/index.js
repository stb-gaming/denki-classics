const { app, BrowserWindow, ipcMain } = require('electron');
const { downloadFile, downloadGame } = require("./download");
const { fileReadable } = require("./utils");
const path = require('path');
const fs = require('fs/promises');
const yaml = require('yaml')

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

const getSettings = async () => {
	const json = await fs.readFile(app.settingsPath);
	return JSON.parse(json);
};

const ipcHandlers = {
	'getFolder': () => app.userDataPath,
	'savesettings': async (event, settings) => {
		await fs.writeFile(app.settingsPath, JSON.stringify(settings, null, 2));
	},
	'loadsettings': async () => await getSettings(),
	'launchgame': async (event, id) => {
		const settings = await getSettings();
		const gamePath = settings.gamesFolder;
		const gameFiles = ["app.html", "app.js", "app.wasm", "app.data"];

		let gameInstalled = true;

		for (const file of gameFiles) {
			if (!fileReadable(path.join(gamePath, id, file))) {
				gameInstalled = false;
				break;
			}
		}

		if (!gameInstalled) {
			return false;
		} else {
			app.mainWindow.loadFile(path.join(gamePath, id, "app.html"));
			return true;
		}
	},
	'installgame': async (event, id) => {
		const settings = await getSettings();
		const gamePath = settings.gamesFolder;
		await downloadGame(id, gamePath);
	},
	'loadgames': async () => {
		const yml = await fs.readFile(app.gamesYaml);
		return yaml.parse(yml);
	}
};

app.whenReady().then(async () => {
	app.userDataPath = app.getPath("userData");
	app.settingsPath = path.join(app.userDataPath, "settings.json");
	app.gamesYaml = path.join(app.userDataPath, "games.yml");

	try {
		await fs.access(app.gamesYaml, fs.constants.R_OK);
		console.log(`games.yml exists in ${app.userDataPath}: OK!`);
	} catch (err) {
		console.error(`games.yml doesn't exist in ${app.userDataPath}, downloading it now.`);
		downloadFile("https://raw.githubusercontent.com/stb-gaming/sky-games/master/_data/games.yml", app.userDataPath);
	}

	Object.entries(ipcHandlers).forEach(([channel, func]) => {
		ipcMain.handle(channel, func);
	});
	app.mainWindow = createWindow();
});
