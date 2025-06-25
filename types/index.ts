export interface TableRow {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
  [key: string]: string | number | undefined;
}

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  type: 'text' | 'number' | 'email';
  sortable: boolean;
  editable: boolean;
  required?: boolean;
}

export interface TableState {
  data: TableRow[];
  columns: ColumnConfig[];
  searchQuery: string;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  rowsPerPage: number;
  editingRows: Set<string>;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
}