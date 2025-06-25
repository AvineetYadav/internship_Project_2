'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Box,
  Chip,
  TableSortLabel,
  useTheme,
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import {
  setCurrentPage,
  setRowsPerPage,
  setSorting,
  updateRow,
  deleteRow,
  startEditing,
  stopEditing,
} from '../store/slices/tableSlice';
import { TableRow as TableRowType } from '../types';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export default function DataTable() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {
    data,
    columns,
    searchQuery,
    sortField,
    sortDirection,
    currentPage,
    rowsPerPage,
    editingRows,
  } = useAppSelector((state) => state.table);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});

  const visibleColumns = columns.filter(col => col.visible);

  // Filter and sort data
  const filteredData = data.filter(row => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return visibleColumns.some(col => {
      const value = row[col.id];
      return value && value.toString().toLowerCase().includes(searchLower);
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (aVal === undefined && bVal === undefined) return 0;
    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;
    
    let comparison = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else {
      comparison = aVal.toString().localeCompare(bVal.toString());
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const paginatedData = sortedData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    dispatch(setSorting({ field, direction: isAsc ? 'desc' : 'asc' }));
  };

  const handleEdit = (rowId: string, row: TableRowType) => {
    setEditValues({ [rowId]: { ...row } });
    dispatch(startEditing(rowId));
  };

  const handleSave = (rowId: string) => {
    const values = editValues[rowId];
    if (values) {
      dispatch(updateRow({ id: rowId, data: values }));
    }
    dispatch(stopEditing(rowId));
    setEditValues(prev => {
      const newValues = { ...prev };
      delete newValues[rowId];
      return newValues;
    });
  };

  const handleCancel = (rowId: string) => {
    dispatch(stopEditing(rowId));
    setEditValues(prev => {
      const newValues = { ...prev };
      delete newValues[rowId];
      return newValues;
    });
  };

  const handleDelete = (rowId: string) => {
    setRowToDelete(rowId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      dispatch(deleteRow(rowToDelete));
    }
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const handleEditValue = (rowId: string, field: string, value: any) => {
    setEditValues(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }));
  };

  const renderCell = (row: TableRowType, column: any) => {
    const isEditing = editingRows.has(row.id);
    const value = isEditing ? editValues[row.id]?.[column.id] ?? row[column.id] : row[column.id];

    if (!isEditing) {
      if (column.id === 'role' || column.id === 'department') {
        return (
          <Chip
            label={value || 'N/A'}
            size="small"
            variant="outlined"
            sx={{
              backgroundColor: theme.palette.primary.main + '20',
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            }}
          />
        );
      }
      return value || 'N/A';
    }

    return (
      <TextField
        size="small"
        type={column.type === 'number' ? 'number' : 'text'}
        value={value || ''}
        onChange={(e) => {
          const newValue = column.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
          handleEditValue(row.id, column.id, newValue);
        }}
        sx={{ minWidth: 120 }}
        error={column.required && (!value || value === '')}
      />
    );
  };

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.shadows[2],
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: theme.palette.grey[50],
                    color: theme.palette.text.primary,
                    ...(theme.palette.mode === 'dark' && {
                      backgroundColor: theme.palette.grey[900],
                    }),
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortField === column.id}
                      direction={sortField === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                      sx={{
                        '& .MuiTableSortLabel-icon': {
                          color: theme.palette.primary.main + ' !important',
                        },
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  fontWeight: 600,
                  backgroundColor: theme.palette.grey[50],
                  color: theme.palette.text.primary,
                  ...(theme.palette.mode === 'dark' && {
                    backgroundColor: theme.palette.grey[900],
                  }),
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const isEditing = editingRows.has(row.id);
              return (
                <TableRow
                  key={row.id}
                  hover={!isEditing}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    ...(isEditing && {
                      backgroundColor: theme.palette.action.selected,
                    }),
                  }}
                >
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} sx={{ py: 1.5 }}>
                      {renderCell(row, column)}
                    </TableCell>
                  ))}
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {isEditing ? (
                        <>
                          <Tooltip title="Save">
                            <IconButton
                              size="small"
                              onClick={() => handleSave(row.id)}
                              color="primary"
                            >
                              <Save fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton
                              size="small"
                              onClick={() => handleCancel(row.id)}
                              color="secondary"
                            >
                              <Cancel fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(row.id, row)}
                              color="primary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(row.id)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedData.length}
        page={currentPage}
        onPageChange={(_, newPage) => dispatch(setCurrentPage(newPage))}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}