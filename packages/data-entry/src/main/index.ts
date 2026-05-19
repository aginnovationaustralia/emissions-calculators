import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { exportAllRecordsToSheet, exportRowToSheet } from './excelExport';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.maximize();

  if (process.env.ELECTRON_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', (event) => {
    const win = mainWindow;
    if (!win || win.isDestroyed()) return;
    event.preventDefault();
    win.webContents.send('app:request-dirty');
    const handleDirtyResult = (_e: Electron.IpcMainEvent, dirty: boolean) => {
      ipcMain.removeListener('app:dirty-result', handleDirtyResult);
      if (win.isDestroyed()) return;
      if (!dirty) {
        win.destroy();
        return;
      }
      const choice = dialog.showMessageBoxSync(win, {
        type: 'question',
        buttons: ['Save', "Don't Save", 'Cancel'],
        defaultId: 0,
        cancelId: 2,
        title: 'Unsaved changes',
        message: 'Save changes before closing?',
      });
      if (choice === 2) return; // Cancel
      if (choice === 1) {
        win.destroy();
        return;
      }
      // Save - renderer will save then send app:close-ok or app:close-cancelled
      ipcMain.once('app:close-ok', () => win.destroy());
      ipcMain.once('app:close-cancelled', () => {});
      if (!win.isDestroyed()) win.webContents.send('app:save-before-close');
    };
    ipcMain.once('app:dirty-result', handleDirtyResult);
  });
}

app.whenReady().then(createWindow);

app.on('before-quit', (event) => {
  const win = mainWindow;
  if (!win || win.isDestroyed()) return;
  event.preventDefault();
  win.webContents.send('app:request-dirty');
  const handleDirtyResult = (_e: Electron.IpcMainEvent, dirty: boolean) => {
    ipcMain.removeListener('app:dirty-result', handleDirtyResult);
    if (win.isDestroyed()) return;
    if (!dirty) {
      app.exit(0);
      return;
    }
    const choice = dialog.showMessageBoxSync(win, {
      type: 'question',
      buttons: ['Save', "Don't Save", 'Cancel'],
      defaultId: 0,
      cancelId: 2,
      title: 'Unsaved changes',
      message: 'Save changes before quitting?',
    });
    if (choice === 2) return;
    if (choice === 1) {
      app.exit(0);
      return;
    }
    ipcMain.once('app:close-ok', () => app.exit(0));
    ipcMain.once('app:close-cancelled', () => {});
    if (!win.isDestroyed()) win.webContents.send('app:save-before-close');
  };
  ipcMain.once('app:dirty-result', handleDirtyResult);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// File I/O API
ipcMain.handle('file:open', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { path: null, data: null, error: null };
  }
  const filePath = result.filePaths[0];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as unknown;
    if (process.env.ELECTRON_VITE_DEV_SERVER_URL) {
      console.log(
        '[main] file:open ok',
        filePath,
        'records:',
        (data as { records?: unknown[] }).records?.length,
      );
    }
    return { path: filePath, data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (process.env.ELECTRON_VITE_DEV_SERVER_URL) {
      console.error('[main] file:open error', filePath, message);
    }
    return { path: null, data: null, error: message };
  }
});

ipcMain.handle('file:save', async (_event, filePath: string, data: unknown) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return { error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: message };
  }
});

ipcMain.handle('file:saveAs', async (_event, data: unknown) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (result.canceled || !result.filePath) {
    return { path: null, error: null };
  }
  const filePath = result.filePath;
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return { path: filePath, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { path: null, error: message };
  }
});

// Excel API - read via fs (same as file:open) so OS permissions match and errors are clear
ipcMain.handle('excel:open', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [{ name: 'Excel', extensions: ['xls', 'xlsx'] }],
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { path: null, sheetNames: [], error: null };
  }
  const filePath = result.filePaths[0];
  try {
    const buffer = fs.readFileSync(filePath);
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const sheetNames = wb.SheetNames ?? [];
    return { path: filePath, sheetNames, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (process.env.ELECTRON_VITE_DEV_SERVER_URL) {
      console.error('[main] excel:open error', filePath, message);
    }
    return { path: null, sheetNames: [], error: message };
  }
});

ipcMain.handle(
  'excel:exportRow',
  async (
    _event,
    args: {
      excelPath: string;
      sheetName: string;
      records: unknown[];
      rowIndex: number;
    },
  ) => {
    try {
      const { excelPath, sheetName, records, rowIndex } = args;
      const buffer = fs.readFileSync(excelPath);
      const wb = XLSX.read(buffer, { type: 'buffer' });
      exportRowToSheet(
        wb,
        sheetName,
        records as import('./excelExport').SymbolRecord[],
        rowIndex,
      );
      const ext = path.extname(excelPath).toLowerCase();
      const bookType = ext === '.xls' ? 'xls' : 'xlsx';
      fs.writeFileSync(excelPath, XLSX.write(wb, { type: 'buffer', bookType }));
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { error: message };
    }
  },
);

ipcMain.handle(
  'excel:exportAll',
  async (
    _event,
    args: {
      excelPath: string;
      sheetName: string;
      records: unknown[];
    },
  ) => {
    try {
      const { excelPath, sheetName, records } = args;
      const buffer = fs.readFileSync(excelPath);
      const wb = XLSX.read(buffer, { type: 'buffer' });
      exportAllRecordsToSheet(
        wb,
        sheetName,
        records as import('./excelExport').SymbolRecord[],
      );
      const ext = path.extname(excelPath).toLowerCase();
      const bookType = ext === '.xls' ? 'xls' : 'xlsx';
      fs.writeFileSync(excelPath, XLSX.write(wb, { type: 'buffer', bookType }));
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { error: message };
    }
  },
);
