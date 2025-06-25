import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableRow, ColumnConfig, TableState } from '../../types';

const defaultColumns: ColumnConfig[] = [
  { id: 'name', label: 'Name', visible: true, type: 'text', sortable: true, editable: true, required: true },
  { id: 'email', label: 'Email', visible: true, type: 'email', sortable: true, editable: true, required: true },
  { id: 'age', label: 'Age', visible: true, type: 'number', sortable: true, editable: true, required: true },
  { id: 'role', label: 'Role', visible: true, type: 'text', sortable: true, editable: true, required: true },
  { id: 'department', label: 'Department', visible: true, type: 'text', sortable: true, editable: true },
  { id: 'location', label: 'Location', visible: true, type: 'text', sortable: true, editable: true },
];

const sampleData: TableRow[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 30, role: 'Developer', department: 'Engineering', location: 'New York' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 28, role: 'Designer', department: 'Design', location: 'San Francisco' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', age: 35, role: 'Manager', department: 'Operations', location: 'Chicago' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', age: 32, role: 'Analyst', department: 'Finance', location: 'Boston' },
  { id: '5', name: 'David Brown', email: 'david@example.com', age: 29, role: 'Developer', department: 'Engineering', location: 'Seattle' },
  { id: '6', name: 'Emily Davis', email: 'emily@example.com', age: 31, role: 'Designer', department: 'Design', location: 'Los Angeles' },
  { id: '7', name: 'Alex Thompson', email: 'alex@example.com', age: 33, role: 'Manager', department: 'Marketing', location: 'Miami' },
  { id: '8', name: 'Lisa Anderson', email: 'lisa@example.com', age: 27, role: 'Developer', department: 'Engineering', location: 'Austin' },
  { id: '9', name: 'Tom Wilson', email: 'tom@example.com', age: 34, role: 'Analyst', department: 'Finance', location: 'Denver' },
  { id: '10', name: 'Maria Garcia', email: 'maria@example.com', age: 26, role: 'Designer', department: 'Design', location: 'Portland' },
  { id: '11', name: 'Chris Lee', email: 'chris@example.com', age: 36, role: 'Manager', department: 'Sales', location: 'Phoenix' },
  { id: '12', name: 'Anna Taylor', email: 'anna@example.com', age: 25, role: 'Intern', department: 'HR', location: 'Atlanta' },
];

const initialState: TableState = {
  data: sampleData,
  columns: defaultColumns,
  searchQuery: '',
  sortField: null,
  sortDirection: 'asc',
  currentPage: 0,
  rowsPerPage: 10,
  editingRows: new Set(),
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload;
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<{ id: string; data: Partial<TableRow> }>) => {
      const index = state.data.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload.data };
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },
    setColumns: (state, action: PayloadAction<ColumnConfig[]>) => {
      state.columns = action.payload;
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.id === action.payload);
      if (column) {
        column.visible = !column.visible;
      }
    },
    addColumn: (state, action: PayloadAction<ColumnConfig>) => {
      state.columns.push(action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 0;
    },
    setSorting: (state, action: PayloadAction<{ field: string; direction: 'asc' | 'desc' }>) => {
      state.sortField = action.payload.field;
      state.sortDirection = action.payload.direction;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.currentPage = 0;
    },
    setEditingRows: (state, action: PayloadAction<Set<string>>) => {
      state.editingRows = action.payload;
    },
    startEditing: (state, action: PayloadAction<string>) => {
      const arr = Array.from(state.editingRows);
      arr.push(action.payload);
      state.editingRows = new Set(arr);
    },
    stopEditing: (state, action: PayloadAction<string>) => {
      const newSet = new Set(state.editingRows);
      newSet.delete(action.payload);
      state.editingRows = newSet;
    },
    stopAllEditing: (state) => {
      state.editingRows = new Set();
    },
  },
});

export const {
  setData,
  addRow,
  updateRow,
  deleteRow,
  setColumns,
  toggleColumnVisibility,
  addColumn,
  setSearchQuery,
  setSorting,
  setCurrentPage,
  setRowsPerPage,
  setEditingRows,
  startEditing,
  stopEditing,
  stopAllEditing,
} = tableSlice.actions;

export default tableSlice.reducer;
