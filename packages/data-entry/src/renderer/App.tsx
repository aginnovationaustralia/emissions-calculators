import { useEffect } from 'react';
import { ExpressionPaste } from './components/ExpressionPaste';
import { RecordsGrid } from './components/RecordsGrid';
import { Toolbar } from './components/Toolbar';
import { useStore } from './store/useStore';
import './styles.css';

const APP_TITLE = 'Data Entry';

function basename(filePath: string): string {
  const last = filePath
    .replace(/[/\\]+$/, '')
    .split(/[/\\]/)
    .pop();
  return last ?? filePath;
}

function App() {
  const loadError = useStore((s) => s.loadError);
  const filePath = useStore((s) => s.filePath);
  const dirty = useStore((s) => s.dirty);

  const filename = filePath ? basename(filePath) : null;

  useEffect(() => {
    document.title = dirty ? `${APP_TITLE} *` : APP_TITLE;
  }, [dirty]);

  useEffect(() => {
    window.electronAPI.onRequestDirty(() => {
      const dirtyState = useStore.getState().dirty;
      window.electronAPI.sendDirtyResult(dirtyState);
    });

    window.electronAPI.onSaveBeforeClose(async () => {
      const {
        records,
        filePath: path,
        setFilePath,
        setDirty,
      } = useStore.getState();
      const data = { records };
      if (path) {
        const result = await window.electronAPI.saveFile(path, data);
        if (result.error) return window.electronAPI.sendCloseCancelled();
        setDirty(false);
        window.electronAPI.sendCloseOk();
      } else {
        const result = await window.electronAPI.saveFileAs(data);
        if (result.error || result.path === null) {
          window.electronAPI.sendCloseCancelled();
          return;
        }
        setFilePath(result.path);
        setDirty(false);
        window.electronAPI.sendCloseOk();
      }
    });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Data Entry</h1>
        {(filename || dirty) && (
          <span className="app-status">
            {filename ? `${filename}${dirty ? ' (modified)' : ''}` : 'Unsaved'}
          </span>
        )}
      </header>
      {loadError && (
        <div className="app-error" role="alert">
          {loadError}
        </div>
      )}
      <Toolbar />
      <ExpressionPaste />
      <main className="app-main">
        <RecordsGrid />
      </main>
    </div>
  );
}

export default App;
