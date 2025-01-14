import { observer } from "mobx-react-lite"
import { FC, useCallback, useEffect, useState } from "react"
import { canExport } from "../../actions"
import { useExportSong } from "../../actions/export"
import { useStores } from "../../hooks/useStores"
import { Localized } from "../../localize/useLocalization"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../Dialog/Dialog"
import { Alert } from "../ui/Alert"
import { Button, PrimaryButton } from "../ui/Button"
import { FileTypeSelector } from "./FileTypeSelector"

export const ExportDialog: FC = observer(() => {
  const rootStore = useStores()
  const { exportStore, song } = rootStore
  const { openExportDialog: open, exportMode } = exportStore
  const exportSong = useExportSong()

  const onClose = useCallback(
    () => (exportStore.openExportDialog = false),
    [exportStore],
  )

  const onClickExport = useCallback(() => {
    exportStore.openExportDialog = false
    exportSong()
  }, [exportStore, exportSong])

  const onChangeMode = useCallback(
    (mode: "WAV" | "MP3") => (exportStore.exportMode = mode),
    [exportStore],
  )

  const [exportEnabled, setExportEnabled] = useState(false)
  useEffect(() => {
    if (open) {
      setExportEnabled(canExport(song))
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose} style={{ minWidth: "20rem" }}>
      <DialogTitle>
        <Localized name="export-audio" />
      </DialogTitle>
      <DialogContent>
        <FileTypeSelector value={exportMode} onChange={onChangeMode} />
        {!exportEnabled && (
          <Alert severity="warning">
            <Localized name="export-error-too-short" />
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <Localized name="close" />
        </Button>
        {exportEnabled && (
          <PrimaryButton onClick={onClickExport}>
            <Localized name="export" />
          </PrimaryButton>
        )}
      </DialogActions>
    </Dialog>
  )
})
