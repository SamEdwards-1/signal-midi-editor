import { useToast } from "dialog-hooks"
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
} from "firebase/auth"
import { observer } from "mobx-react-lite"
import { FC, useEffect, useState } from "react"
import { ElectronAPI } from "../../../../electron/src/ElectronAPI"
import { FirebaseCredential } from "../../../../electron/src/FirebaseCredential"
import { auth } from "../.././firebase/firebase"
import { useSetSong } from "../../actions"
import { songFromArrayBuffer } from "../../actions/file"
import { useRedo, useUndo } from "../../actions/history"
import {
  useCopySelectionGlobal,
  useCutSelectionGlobal,
  usePasteSelectionGlobal,
} from "../../actions/hotkey"
import { useCloudFile } from "../../hooks/useCloudFile"
import { useSongFile } from "../../hooks/useSongFile"
import { useStores } from "../../hooks/useStores"
import { useLocalization } from "../../localize/useLocalization"
import { songToMidi } from "../../midi/midiConversion"

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export const ElectronCallbackHandler: FC = observer(() => {
  const { songStore, authStore, exportStore, rootViewStore } = useStores()
  const localized = useLocalization()
  const localSongFile = useSongFile()
  const cloudSongFile = useCloudFile()
  const toast = useToast()
  const cutSelectionGlobal = useCutSelectionGlobal()
  const copySelectionGlobal = useCopySelectionGlobal()
  const pasteSelectionGlobal = usePasteSelectionGlobal()
  const undo = useUndo()
  const redo = useRedo()
  const [isInitialized, setIsInitialized] = useState(false)
  const setSong = useSetSong()

  const saveFileAs = async () => {
    const { song } = songStore
    try {
      const res = await window.electronAPI.showSaveDialog()
      if (res === null) {
        return // canceled
      }
      const { path } = res
      const data = songToMidi(song).buffer
      song.filepath = path
      song.isSaved = true
      await window.electronAPI.saveFile(path, data)
      window.electronAPI.addRecentDocument(path)
    } catch (e) {
      alert((e as Error).message)
    }
  }

  useEffect(() => {
    const unsubscribes = [
      window.electronAPI.onNewFile(async () => {
        const { isLoggedIn } = authStore

        if (isLoggedIn) {
          await cloudSongFile.createNewSong()
        } else {
          await localSongFile.createNewSong()
        }
      }),
      window.electronAPI.onClickOpenFile(async () => {
        const { isLoggedIn } = authStore

        if (isLoggedIn) {
          await cloudSongFile.openSong()
        } else {
          const { song } = songStore
          try {
            if (song.isSaved || confirm(localized["confirm-open"])) {
              const res = await window.electronAPI.showOpenDialog()
              if (res === null) {
                return // canceled
              }
              const { path, content } = res
              const song = songFromArrayBuffer(content, path)
              setSong(song)
              window.electronAPI.addRecentDocument(path)
            }
          } catch (e) {
            alert((e as Error).message)
          }
        }
      }),
      window.electronAPI.onOpenFile(async ({ filePath }) => {
        const { song } = songStore
        try {
          if (song.isSaved || confirm(localized["confirm-open"])) {
            const data = await window.electronAPI.readFile(filePath)
            const song = songFromArrayBuffer(data, filePath)
            setSong(song)
            window.electronAPI.addRecentDocument(filePath)
          }
        } catch (e) {
          alert((e as Error).message)
        }
      }),
      window.electronAPI.onSaveFile(async () => {
        const { isLoggedIn } = authStore
        const { song } = songStore

        if (isLoggedIn) {
          await cloudSongFile.saveSong()
        } else {
          try {
            if (song.filepath) {
              const data = songToMidi(songStore.song).buffer
              await window.electronAPI.saveFile(song.filepath, data)
              song.isSaved = true
            } else {
              await saveFileAs()
            }
          } catch (e) {
            alert((e as Error).message)
          }
        }
      }),
      window.electronAPI.onSaveFileAs(async () => {
        const { isLoggedIn } = authStore

        if (isLoggedIn) {
          await cloudSongFile.saveAsSong()
        } else {
          await saveFileAs()
        }
      }),
      window.electronAPI.onRename(async () => {
        await cloudSongFile.renameSong()
      }),
      window.electronAPI.onImport(async () => {
        await cloudSongFile.importSong()
      }),
      window.electronAPI.onExportWav(() => {
        exportStore.openExportDialog = true
      }),
      window.electronAPI.onUndo(() => {
        undo()
      }),
      window.electronAPI.onRedo(() => {
        redo()
      }),
      window.electronAPI.onCut(() => {
        cutSelectionGlobal()
      }),
      window.electronAPI.onCopy(() => {
        copySelectionGlobal()
      }),
      window.electronAPI.onPaste(() => {
        pasteSelectionGlobal()
      }),
      window.electronAPI.onOpenSetting(() => {
        rootViewStore.openSettingDialog = true
      }),
      window.electronAPI.onOpenHelp(() => {
        rootViewStore.openHelp = true
      }),
      window.electronAPI.onBrowserSignInCompleted(
        async ({ credential: credentialJSON }) => {
          const credential = createCredential(credentialJSON)
          try {
            await signInWithCredential(auth, credential)
          } catch (e) {
            toast.error("Failed to sign in")
          }
        },
      ),
    ]
    if (!isInitialized) {
      setIsInitialized(true)
      window.electronAPI.ready()
    }
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [
    isInitialized,
    cutSelectionGlobal,
    copySelectionGlobal,
    pasteSelectionGlobal,
    redo,
    undo,
  ])

  return <></>
})

function createCredential(credential: FirebaseCredential) {
  switch (credential.providerId) {
    case "google.com":
      return GoogleAuthProvider.credential(
        credential.idToken,
        credential.accessToken,
      )
    case "github.com":
      return GithubAuthProvider.credential(credential.accessToken)
    case "apple.com":
      let provider = new OAuthProvider("apple.com")
      return provider.credential({
        idToken: credential.idToken,
        accessToken: credential.accessToken,
      })
    default:
      throw new Error("Invalid provider")
  }
}
