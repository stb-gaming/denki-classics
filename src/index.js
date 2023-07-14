const { app, BrowserWindow, ipcMain } = require('electron');
const { downloadFile } = require("./download");
const { fileReadable } = require("./utils");

const fs = require("fs/promises");
const path = require('path');
const { isReadable } = require('stream');


const createWindow = async () => {
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

	await win.webContents.insertCSS((await fs.readFile(path.join(app.assetsPaths.css, "base.css"))).toString());
	await win.webContents.insertCSS(await (await fs.readFile(path.join(app.assetsPaths.css, "sky-games.css"))).toString());


	win.webContents.on("did-finish-load", async () => {

		console.log(win.representedFilename);

		await win.webContents.executeJavaScript((await fs.readFile(path.join(app.assetsPaths.userscripts, "sky-remote.user.js"))).toString());
		await win.webContents.executeJavaScript((await fs.readFile(path.join(app.assetsPaths.js, "menu.js"))).toString());
		await win.webContents.executeJavaScript((await fs.readFile(path.join(app.assetsPaths.js, "sky-games.js"))).toString());


	});

	return win;
};

/*

*/


app.whenReady().then(async () => {
	const assets = require("./assets");

	app.userDataPath = app.getPath("userData");
	app.assetsRoot = path.join(app.userDataPath, "Assets");
	app.settingsPath = path.join(app.userDataPath, "settings.json");
	app.gamesYaml = path.join(app.userDataPath, "games.yml");

	app.assetsPaths = {
		css: path.join(app.assetsRoot, "css"),
		js: path.join(app.assetsRoot, "js"),
		userscripts: path.join(app.assetsRoot, "userscripts"),
	};

	Object.entries(app.assetsPaths).forEach(async ([type, path]) => {
		if (!isReadable(path)) {
			await fs.mkdir(path, { recursive: true });
		}
		Object.values(assets[type]).forEach(async assetUrl => {
			await downloadFile(assetUrl, path);
		});
	});

	if (!await fileReadable(app.settingsPath)) {
		await fs.writeFile(app.settingsPath, JSON.stringify(require("./defaults"), null, 2));
	}
	if (await fileReadable(app.gamesYaml)) {
		console.log(`games.yml exists in ${app.userDataPath}: OK!`);
	} else {
		console.error(`games.yml doesn't exist yet - downloading to ${app.gamesYaml}`);
		await downloadFile("https://raw.githubusercontent.com/stb-gaming/sky-games/master/_data/games.yml", app.userDataPath);
	}

	Object.entries(require("./handlers")).forEach(([channel, func]) => {
		ipcMain.handle(channel, func);
	});
	app.mainWindow = createWindow();
});
