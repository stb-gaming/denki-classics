const { contextBridge, ipcRenderer, app } = require('electron');

contextBridge.exposeInMainWorld("SkyGames", {

	folder: () => ipcRenderer.invoke('getfolder')
});
