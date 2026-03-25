import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { extractSymbols } from '@/shared/expressionParser';
import { createEmptyRecord } from '@/shared/schema';
import type { RecordType, SymbolRecord } from '@/shared/types';
import { useStore } from '../store/useStore';
import { buildHighlightSegments } from '../utils/expressionHighlight';

const TYPES: RecordType[] = ['expression', 'constant', 'input', 'unknown'];

/** Navigable column indices: Symbol=0, Name=1, Units=2, Type=3, Expression=4, Line=5, Notes=6, Values=7 */
const NUM_NAV_COLS = 8;

type FocusableEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface GridNavContextValue {
  registerCell: (row: number, col: number, el: FocusableEl | null) => void;
  handleKeyDown: (
    e: React.KeyboardEvent<FocusableEl>,
    row: number,
    col: number,
  ) => void;
  numRows: number;
  numCols: number;
}

const GridNavContext = createContext<GridNavContextValue | null>(null);

function useGridNav() {
  const ctx = useContext(GridNavContext);
  return ctx;
}

const DRAG_RECORD_INDEX = 'application/x-record-index';

export function RecordsGrid() {
  const records = useStore((s) => s.records);
  const updateRecord = useStore((s) => s.updateRecord);
  const removeRecord = useStore((s) => s.removeRecord);
  const moveRecordTo = useStore((s) => s.moveRecordTo);
  const addRecord = useStore((s) => s.addRecord);
  const excelFilePath = useStore((s) => s.excelFilePath);
  const selectedExcelSheet = useStore((s) => s.selectedExcelSheet);
  const setLoadError = useStore((s) => s.setLoadError);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const cellsRef = useRef<Map<string, FocusableEl>>(new Map());

  /** Row indices whose name cells are outlined while an expression cell is focused (null = no expression focused). */
  const [expressionDependencyRows, setExpressionDependencyRows] = useState<
    number[] | null
  >(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const dragIndexStr = e.dataTransfer.getData(DRAG_RECORD_INDEX);
      if (dragIndexStr === '') return;
      const dragIndex = parseInt(dragIndexStr, 10);
      if (Number.isNaN(dragIndex) || dragIndex < 0 || dragIndex >= records.length)
        return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || !tbodyRef.current?.contains(el)) return;
      let tr: Element | null = el;
      while (tr && tr.tagName !== 'TR') tr = tr.parentElement;
      if (!tr) return;
      const rowIndexStr = (tr as HTMLElement).dataset.rowIndex;
      if (rowIndexStr === undefined) return;
      const rowIndex = parseInt(rowIndexStr, 10);
      if (Number.isNaN(rowIndex)) return;
      const rect = tr.getBoundingClientRect();
      const inTopHalf = e.clientY - rect.top < rect.height / 2;
      const toIndex = inTopHalf ? rowIndex : rowIndex + 1;
      const clampedTo = Math.max(0, Math.min(toIndex, records.length - 1));
      if (clampedTo === dragIndex) return;
      moveRecordTo(dragIndex, clampedTo);
    },
    [records.length, moveRecordTo],
  );

  const registerCell = useCallback((row: number, col: number, el: FocusableEl | null) => {
    const key = `${row},${col}`;
    if (el) cellsRef.current.set(key, el);
    else cellsRef.current.delete(key);
  }, []);

  const focusCell = useCallback((row: number, col: number) => {
    const key = `${row},${col}`;
    const el = cellsRef.current.get(key);
    if (el) el.focus();
  }, []);

  const handleKeyDown = useCallback<GridNavContextValue['handleKeyDown']>(
    (e, row, col) => {
      const target = e.target as FocusableEl;
      const isSelect = target instanceof HTMLSelectElement;
      const start = isSelect ? 0 : (target as HTMLInputElement).selectionStart ?? 0;
      const len = (target as HTMLInputElement).value?.length ?? 0;

      if (e.key === 'ArrowLeft') {
        if (start === 0 && col > 0) {
          e.preventDefault();
          focusCell(row, col - 1);
        }
        return;
      }
      if (e.key === 'ArrowRight') {
        if ((isSelect || start === len) && col < NUM_NAV_COLS - 1) {
          e.preventDefault();
          focusCell(row, col + 1);
        }
        return;
      }
      if (e.key === 'ArrowUp') {
        if (row > 0) {
          e.preventDefault();
          focusCell(row - 1, col);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        if (row < records.length - 1) {
          e.preventDefault();
          focusCell(row + 1, col);
        }
      }
    },
    [focusCell, records.length],
  );

  const gridNavValue = useMemo<GridNavContextValue>(
    () => ({
      registerCell,
      handleKeyDown,
      numRows: records.length,
      numCols: NUM_NAV_COLS,
    }),
    [registerCell, handleKeyDown, records.length],
  );

  return (
    <GridNavContext.Provider value={gridNavValue}>
      <div className="records-grid-wrap">
        <table className="records-grid">
          <thead>
            <tr>
              <th className="col-order"></th>
              <th>Symbol</th>
              <th>Name</th>
              <th>Units</th>
              <th>Type</th>
              <th className="col-expression">Expression</th>
              <th className="col-line">Line</th>
              <th>Notes</th>
              <th>Values</th>
              <th></th>
            </tr>
          </thead>
          <tbody
            ref={tbodyRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {records.map((record, i) => (
              <RecordRow
                key={`${record.symbol}-${i}`}
                record={record}
                index={i}
                records={records}
                onUpdate={(updates) => updateRecord(i, updates)}
                onRemove={() => removeRecord(i)}
                excelFilePath={excelFilePath}
                selectedExcelSheet={selectedExcelSheet}
                setLoadError={setLoadError}
                dependencyHighlightRows={expressionDependencyRows}
                onExpressionDependencyHighlight={setExpressionDependencyRows}
              />
            ))}
          </tbody>
        </table>
      {records.length === 0 && (
        <p className="records-empty">No records. Paste an expression above or add data manually.</p>
      )}
      <div className="records-grid-actions">
        <button
          type="button"
          className="records-new-record-btn"
          onClick={() => addRecord(createEmptyRecord('', 'unknown'))}
        >
          New record
        </button>
      </div>
    </div>
    </GridNavContext.Provider>
  );
}

function ExpressionCell({
  value,
  disabled,
  onChange,
  existingSymbols,
  records,
  rowIndex,
  colIndex,
  onDependencyHighlightChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
  existingSymbols: string[];
  records: SymbolRecord[];
  rowIndex: number;
  colIndex: number;
  onDependencyHighlightChange: (rowIndices: number[] | null) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const gridNav = useGridNav();

  const tokensToHighlight = useMemo(() => {
    const tokens = extractSymbols(value);
    const set = new Set(existingSymbols.map((s) => s.toLowerCase()));
    return tokens.filter((t) => set.has(t.toLowerCase()));
  }, [value, existingSymbols]);
  const segments = useMemo(
    () => buildHighlightSegments(value, tokensToHighlight, null),
    [value, tokensToHighlight],
  );

  const dependencyRowIndices = useMemo(() => {
    const lower = (s: string) => s.toLowerCase();
    const tokenSet = new Set(tokensToHighlight.map(lower));
    const indices: number[] = [];
    records.forEach((r, i) => {
      if (tokenSet.has(lower(r.symbol))) indices.push(i);
    });
    return indices;
  }, [tokensToHighlight, records]);

  const syncDependencyHighlightIfFocused = useCallback(() => {
    if (disabled) return;
    const ta = textareaRef.current;
    if (!ta || document.activeElement !== ta) return;
    onDependencyHighlightChange(dependencyRowIndices);
  }, [disabled, dependencyRowIndices, onDependencyHighlightChange]);

  useEffect(() => {
    syncDependencyHighlightIfFocused();
  }, [syncDependencyHighlightIfFocused]);

  useEffect(() => {
    const ta = textareaRef.current;
    const hl = highlightRef.current;
    if (!ta || !hl) return;
    const syncScroll = () => {
      hl.scrollTop = ta.scrollTop;
      hl.scrollLeft = ta.scrollLeft;
    };
    ta.addEventListener('scroll', syncScroll);
    return () => ta.removeEventListener('scroll', syncScroll);
  }, []);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!gridNav) return;
    gridNav.registerCell(rowIndex, colIndex, ta);
    return () => gridNav.registerCell(rowIndex, colIndex, null);
  }, [gridNav, rowIndex, colIndex]);

  return (
    <div
      className={`expression-cell-wrap ${disabled ? 'expression-cell-disabled' : ''}`}
    >
      <div ref={highlightRef} className="expression-cell-highlight" aria-hidden>
        {segments.map((seg, i) =>
          seg.type === 'token' ? (
            <mark key={i} className="expression-cell-token">
              {seg.value}
            </mark>
          ) : (
            <span key={i}>{seg.value}</span>
          ),
        )}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (!disabled) onDependencyHighlightChange(dependencyRowIndices);
        }}
        onBlur={() => {
          if (!disabled) onDependencyHighlightChange(null);
        }}
        onKeyDown={gridNav ? (e) => gridNav.handleKeyDown(e, rowIndex, colIndex) : undefined}
        disabled={disabled}
        rows={2}
        className={`expression-cell-input ${disabled ? 'cell-disabled' : ''}`}
      />
    </div>
  );
}

function RecordRow({
  record,
  index,
  records,
  onUpdate,
  onRemove,
  excelFilePath,
  selectedExcelSheet,
  setLoadError,
  dependencyHighlightRows,
  onExpressionDependencyHighlight,
}: {
  record: SymbolRecord;
  index: number;
  records: SymbolRecord[];
  onUpdate: (u: Partial<SymbolRecord>) => void;
  onRemove: () => void;
  excelFilePath: string | null;
  selectedExcelSheet: string | null;
  setLoadError: (error: string | null) => void;
  dependencyHighlightRows: number[] | null;
  onExpressionDependencyHighlight: (rowIndices: number[] | null) => void;
}) {
  const gridNav = useGridNav();
  const isExpression = record.type === 'expression';
  const isConstant = record.type === 'constant';
  const canExport =
    !!excelFilePath &&
    !!selectedExcelSheet &&
    isExpression &&
    !!record.expression.trim();

  const onExport = useCallback(async () => {
    if (!excelFilePath || !selectedExcelSheet) return;
    const result = await window.electronAPI.exportRowToExcel({
      excelPath: excelFilePath,
      sheetName: selectedExcelSheet,
      records,
      rowIndex: index,
    });
    if (result.error) setLoadError(result.error);
  }, [excelFilePath, selectedExcelSheet, records, index, setLoadError]);

  const isComplete =
    record.name.trim() !== '' &&
    record.units.trim() !== '' &&
    record.line.trim() !== '';

  const existingSymbols = useMemo(
    () => records.map((r) => r.symbol),
    [records],
  );

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData(DRAG_RECORD_INDEX, String(index));
    e.dataTransfer.effectAllowed = 'move';
  }, [index]);

  const highlightNameAsDependency =
    dependencyHighlightRows !== null && dependencyHighlightRows.includes(index);

  return (
    <tr data-row-index={index}>
      <td className="col-order">
        <div
          className="row-drag-handle"
          draggable
          onDragStart={handleDragStart}
          title="Drag to reorder row"
          aria-label="Drag to reorder row"
        >
          <span className="row-drag-handle-icon" aria-hidden>
            <span className="row-drag-bar" />
            <span className="row-drag-bar" />
            <span className="row-drag-bar" />
          </span>
        </div>
      </td>
      <td className={isComplete ? 'cell-symbol cell-symbol-complete' : 'cell-symbol'}>
        <input
          ref={(el) => gridNav?.registerCell(index, 0, el)}
          type="text"
          value={record.symbol}
          onChange={(e) => onUpdate({ symbol: e.target.value })}
          onKeyDown={gridNav ? (e) => gridNav.handleKeyDown(e, index, 0) : undefined}
          className="cell-symbol-input"
        />
      </td>
      <td
        className={highlightNameAsDependency ? 'cell-name-expression-dep' : undefined}
      >
        <input
          ref={(el) => gridNav?.registerCell(index, 1, el)}
          type="text"
          value={record.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          onKeyDown={gridNav ? (e) => gridNav.handleKeyDown(e, index, 1) : undefined}
        />
      </td>
      <td>
        <input
          ref={(el) => gridNav?.registerCell(index, 2, el)}
          type="text"
          value={record.units}
          onChange={(e) => onUpdate({ units: e.target.value })}
          onKeyDown={gridNav ? (e) => gridNav.handleKeyDown(e, index, 2) : undefined}
        />
      </td>
      <td>
        <select
          ref={(el) => gridNav?.registerCell(index, 3, el)}
          value={record.type}
          onChange={(e) => onUpdate({ type: e.target.value as RecordType })}
          onKeyDown={gridNav ? (e) => gridNav.handleKeyDown(e, index, 3) : undefined}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </td>
      <td className="col-expression">
        <ExpressionCell
          value={record.expression}
          disabled={!isExpression}
          onChange={(v) => onUpdate({ expression: v })}
          existingSymbols={existingSymbols}
          records={records}
          rowIndex={index}
          colIndex={4}
          onDependencyHighlightChange={onExpressionDependencyHighlight}
        />
      </td>
      <td className="col-line">
        <input
          ref={(el) => gridNav?.registerCell(index, 5, el)}
          type="text"
          value={record.line}
          onChange={(e) => onUpdate({ line: e.target.value })}
          onKeyDown={gridNav ? (e) => gridNav.handleKeyDown(e, index, 5) : undefined}
        />
      </td>
      <td>
        <input
          ref={(el) => gridNav?.registerCell(index, 6, el)}
          type="text"
          value={record.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          onKeyDown={gridNav ? (e) => gridNav.handleKeyDown(e, index, 6) : undefined}
        />
      </td>
      <td>
        <input
          ref={(el) => gridNav?.registerCell(index, 7, el)}
          type="text"
          value={record.values ?? ''}
          onChange={(e) => onUpdate({ values: e.target.value })}
          disabled={!isConstant}
          className={isConstant ? '' : 'cell-disabled'}
          onKeyDown={gridNav ? (e) => gridNav.handleKeyDown(e, index, 7) : undefined}
        />
      </td>
      <td>
        <button
          type="button"
          onClick={onExport}
          disabled={!canExport}
          className="btn-export"
          aria-label="Export to Excel"
          title={canExport ? 'Export expression to Excel' : 'Load an Excel file and select a sheet to export'}
        >
          Export
        </button>
        <button type="button" onClick={onRemove} className="btn-remove" aria-label="Remove row">
          Remove
        </button>
      </td>
    </tr>
  );
}
