import { contextBridge, ipcRenderer } from 'electron';

export type FileOpenResult = {
  path: string | null;
  data: unknown;
  error: string | null;
};

export type FileSaveResult = { error: string | null };

export type FileSaveAsResult = { path: string | null; error: string | null };

export type ExcelOpenResult = {
  path: string | null;
  sheetNames: string[];
  error: string | null;
};

export type ExcelExportRowArgs = {
  excelPath: string;
  sheetName: string;
  records: unknown[];
  rowIndex: number;
};

export type ExcelExportRowResult = { error: string | null };

export type ExcelExportAllArgs = {
  excelPath: string;
  sheetName: string;
  records: unknown[];
};

export type ExcelExportAllResult = { error: string | null };

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('file:open') as Promise<FileOpenResult>,
  openExcelFile: () =>
    ipcRenderer.invoke('excel:open') as Promise<ExcelOpenResult>,
  exportRowToExcel: (args: ExcelExportRowArgs) =>
    ipcRenderer.invoke('excel:exportRow', args) as Promise<ExcelExportRowResult>,
  exportAllToExcel: (args: ExcelExportAllArgs) =>
    ipcRenderer.invoke('excel:exportAll', args) as Promise<ExcelExportAllResult>,
  saveFile: (filePath: string, data: unknown) =>
    ipcRenderer.invoke('file:save', filePath, data) as Promise<FileSaveResult>,
  saveFileAs: (data: unknown) =>
    ipcRenderer.invoke('file:saveAs', data) as Promise<FileSaveAsResult>,
  onRequestDirty: (callback: () => void) => {
    ipcRenderer.on('app:request-dirty', callback);
  },
  sendDirtyResult: (dirty: boolean) => {
    ipcRenderer.send('app:dirty-result', dirty);
  },
  onSaveBeforeClose: (callback: () => void) => {
    ipcRenderer.on('app:save-before-close', callback);
  },
  sendCloseOk: () => ipcRenderer.send('app:close-ok'),
  sendCloseCancelled: () => ipcRenderer.send('app:close-cancelled'),
});
