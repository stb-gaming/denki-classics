const { app } = require("electron");
const { fileReadable } = require("./utils");
const { downloadGame } = require("./download");

const yml = require("yml");
const fs = require("fs/promises");

const getSettings = async () => {
	const json = await fs.readFile(app.settingsPath);
	return JSON.parse(json);
};

module.exports = {
	'getFolder': () => app.getPath("userData"),
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
		/*
		//const yml = await fs.readFile(app.gamesYaml);
		//return yaml.parse(yml)
		*/
		return yml.load(app.gamesYaml);
	}
};