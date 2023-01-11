const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('theme', {
  light: () => ipcRenderer.invoke('theme:light'),
  dark: () => ipcRenderer.invoke('theme:dark'),
  system: () => ipcRenderer.invoke('theme:system'),
  get: () => ipcRenderer.invoke('theme:get')
})

contextBridge.exposeInMainWorld('dbMember', {
  create: async (data) => await ipcRenderer.invoke('dbMember:create', data)
})

contextBridge.exposeInMainWorld('idGen', {
  gen: () => ipcRenderer.invoke('idGen:gen')
})
