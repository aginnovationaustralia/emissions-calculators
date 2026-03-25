/// <reference types="vite/client" />

declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<{ path: string | null; data: unknown; error: string | null }>;
      saveFile: (filePath: string, data: unknown) => Promise<{ error: string | null }>;
      saveFileAs: (data: unknown) => Promise<{ path: string | null; error: string | null }>;
      openExcelFile: () => Promise<{ path: string | null; sheetNames: string[]; error: string | null }>;
      exportRowToExcel: (args: {
        excelPath: string;
        sheetName: string;
        records: unknown[];
        rowIndex: number;
      }) => Promise<{ error: string | null }>;
      exportAllToExcel: (args: {
        excelPath: string;
        sheetName: string;
        records: unknown[];
      }) => Promise<{ error: string | null }>;
      onRequestDirty: (callback: () => void) => void;
      sendDirtyResult: (dirty: boolean) => void;
      onSaveBeforeClose: (callback: () => void) => void;
      sendCloseOk: () => void;
      sendCloseCancelled: () => void;
    };
  }
}

export {};
