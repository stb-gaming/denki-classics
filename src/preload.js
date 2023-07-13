const { contextBridge, ipcRenderer, app } = require('electron');

contextBridge.exposeInMainWorld("SkyGames", {
	folder: () => ipcRenderer.invoke('getfolder'),
	saveSettings: (settings) => ipcRenderer.invoke('savesettings', settings),
	loadSettings: () => ipcRenderer.invoke('loadsettings'),
	installGame: (id) => ipcRenderer.invoke('installgame', id),
	launchGame: (id) => ipcRenderer.invoke('launchgame', id),
	loadGames: () => ipcRenderer.invoke('loadgames')
});
