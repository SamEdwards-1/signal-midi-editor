import {
  BrowserWindow,
  IpcMainInvokeEvent,
  app,
  dialog,
  ipcMain,
} from "electron"
import { readFile, readdir, writeFile } from "fs/promises"
import { isAbsolute, join } from "path"
import { getArgument } from "./arguments"
import { Ipc } from "./ipc"

const api = (ipc: Ipc) => ({
  showOpenDialog: async () => {
    const fileObj = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "MIDI File", extensions: ["mid", "midi"] }],
    })
    if (fileObj.canceled) {
      return null
    }
    const path = fileObj.filePaths[0]
    const content = await readFile(path)
    return { path, content: content.buffer }
  },
  showOpenDirectoryDialog: async () => {
    const fileObj = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    })
    if (fileObj.canceled) {
      return null
    }
    const path = fileObj.filePaths[0]
    return path
  },
  saveFile: async (_e: IpcMainInvokeEvent, path: string, data: ArrayBuffer) => {
    await writeFile(path, Buffer.from(data))
  },
  readFile: async (_e: IpcMainInvokeEvent, path: string) => {
    const filePath = isAbsolute(path) ? path : join(app.getAppPath(), path)
    const content = await readFile(filePath)
    return content.buffer
  },
  searchSoundFonts: async (_e: IpcMainInvokeEvent, path: string) => {
    const files = await readdir(path, { withFileTypes: true })
    return files
      .filter((f) => f.isFile() && f.name.endsWith(".sf2"))
      .map((f) => join(f.path, f.name))
  },
  showSaveDialog: async () => {
    const fileObj = await dialog.showSaveDialog({
      filters: [{ name: "MIDI File", extensions: ["mid", "midi"] }],
    })
    if (fileObj.canceled) {
      return null
    }
    const path = fileObj.filePath
    if (!path) {
      return null
    }
    return { path }
  },
  addRecentDocument: (_e: IpcMainInvokeEvent, path: string) => {
    app.addRecentDocument(path)
  },
  getArgument: async () => getArgument(),
  openAuthWindow: async () => {
    const window = new BrowserWindow({
      width: 500,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    })
    window.webContents.on("will-navigate", (e, url) => {
      // check if url has the parameter idToken
      const idToken = new URL(url).searchParams.get("idToken")
      if (idToken) {
        window.close()
        ipc.send("onIdTokenReceived", { idToken })
      }
    })
    window.loadURL(
      app.isPackaged
        ? "https://signal.vercel.app/auth"
        : "http://localhost:3000/auth",
    )
  },
})

export type IpcMainAPI = ReturnType<typeof api>

export const registerIpcMain = (ipc: Ipc) => {
  Object.entries(api(ipc)).forEach(([name, func]) => {
    ipcMain.handle(name, func)
  })
}
