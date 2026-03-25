import { useStore } from '../store/useStore';
import { parseFileData } from '@/shared/schema';

export function Toolbar() {
  const {
    records,
    filePath,
    dirty,
    newDocument,
    setFilePath,
    setDirty,
    setLoadError,
    loadFromJson,
    excelFilePath,
    excelSheetNames,
    selectedExcelSheet,
    setExcelFile,
    setSelectedExcelSheet,
  } = useStore();

  async function handleNew() {
    if (dirty && records.length > 0) {
      const ok = window.confirm('Unsaved changes will be lost. Continue?');
      if (!ok) return;
    }
    newDocument();
  }

  async function handleOpen() {
    const result = await window.electronAPI.openFile();
    if (result.error) {
      setLoadError(result.error);
      return;
    }
    if (result.path === null || result.data === null) return;
    const parsed = parseFileData(result.data);
    if (!parsed.success) {
      setLoadError(parsed.error);
      return;
    }
    loadFromJson(parsed.data);
    setFilePath(result.path);
    setLoadError(null);
  }

  async function handleSave() {
    if (!filePath) {
      handleSaveAs();
      return;
    }
    const result = await window.electronAPI.saveFile(filePath, { records });
    if (result.error) {
      setLoadError(result.error);
      return;
    }
    setDirty(false);
  }

  async function handleSaveAs() {
    const result = await window.electronAPI.saveFileAs({ records });
    if (result.error) {
      setLoadError(result.error);
      return;
    }
    if (result.path) {
      setFilePath(result.path);
      setDirty(false);
    }
  }

  async function handleLoadExcel() {
    const result = await window.electronAPI.openExcelFile();
    if (result.error) {
      setLoadError(result.error);
      return;
    }
    if (result.path !== null) {
      setExcelFile(result.path, result.sheetNames);
      setLoadError(null);
    }
  }

  async function handleExportAll() {
    if (!excelFilePath || !selectedExcelSheet) return;
    const result = await window.electronAPI.exportAllToExcel({
      excelPath: excelFilePath,
      sheetName: selectedExcelSheet,
      records,
    });
    if (result.error) setLoadError(result.error);
    else setLoadError(null);
  }

  const canExportAll =
    !!excelFilePath &&
    !!selectedExcelSheet &&
    records.some((r) => r.symbol.trim() !== '');

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button type="button" onClick={handleNew}>
          New
        </button>
        <button type="button" onClick={handleOpen}>
          Open
        </button>
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={handleSaveAs}>
          Save As
        </button>
      </div>
      <div className="toolbar-excel">
        <button type="button" onClick={handleLoadExcel}>
          Load Excel
        </button>
        {excelFilePath && (
          <span className="toolbar-excel-filename" title={excelFilePath}>
            {excelFilePath.split(/[/\\]/).pop() ?? excelFilePath}
          </span>
        )}
        <select
          className="toolbar-sheet-select"
          value={selectedExcelSheet ?? ''}
          onChange={(e) =>
            setSelectedExcelSheet(e.target.value || null)
          }
          disabled={excelSheetNames.length === 0}
          title={excelFilePath ?? undefined}
        >
          <option value="">{excelSheetNames.length === 0 ? 'No sheet' : 'Select sheet'}</option>
          {excelSheetNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleExportAll}
          disabled={!canExportAll}
          title={
            canExportAll
              ? 'Append all records as new columns (row 10 = symbols, row 11 = formulas)'
              : 'Load Excel, choose a sheet, and add at least one symbol to export'
          }
        >
          Export all
        </button>
      </div>
    </div>
  );
}
