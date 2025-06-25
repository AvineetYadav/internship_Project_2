import { saveAs } from 'file-saver';
import { TableRow, ColumnConfig } from '../types';

export const exportToCSV = (
  data: TableRow[],
  columns: ColumnConfig[],
  filename: string = 'table-data.csv'
) => {
  // Get visible columns only
  const visibleColumns = columns.filter(col => col.visible);
  
  // Create header row
  const headers = visibleColumns.map(col => col.label);
  
  // Create data rows
  const rows = data.map(row => 
    visibleColumns.map(col => {
      const value = row[col.id];
      // Handle undefined/null values and escape commas/quotes
      if (value === undefined || value === null) return '';
      const stringValue = value.toString();
      // Escape quotes and wrap in quotes if contains comma or quote
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    })
  );
  
  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};