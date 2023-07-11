const { contextBridge, ipcRenderer, app } = require('electron');

contextBridge.exposeInMainWorld("SkyGames", {
	folder: () => ipcRenderer.invoke('getfolder'),
	saveSettings: (settings) => ipcRenderer.invoke('savesettings', settings),
	loadSettings: () => ipcRenderer.invoke('loadsettings')
});
