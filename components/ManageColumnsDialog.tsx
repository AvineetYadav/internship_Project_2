'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
} from '@mui/material';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { toggleColumnVisibility, addColumn } from '../store/slices/tableSlice';
import { ColumnConfig } from '../types';

interface ManageColumnsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ManageColumnsDialog({
  open,
  onClose,
}: ManageColumnsDialogProps) {
  const dispatch = useAppDispatch();
  const { columns } = useAppSelector((state) => state.table);
  
  const [newColumn, setNewColumn] = useState({
    id: '',
    label: '',
    type: 'text' as 'text' | 'number' | 'email',
    visible: true,
    sortable: true,
    editable: true,
  });

  const handleToggleVisibility = (columnId: string) => {
    dispatch(toggleColumnVisibility(columnId));
  };

  const handleAddColumn = () => {
    if (newColumn.id && newColumn.label) {
      const column: ColumnConfig = {
        ...newColumn,
        id: newColumn.id.toLowerCase().replace(/\s+/g, '_'),
      };
      dispatch(addColumn(column));
      setNewColumn({
        id: '',
        label: '',
        type: 'text',
        visible: true,
        sortable: true,
        editable: true,
      });
    }
  };

  const isAddDisabled = !newColumn.id || !newColumn.label || 
    columns.some(col => col.id === newColumn.id.toLowerCase().replace(/\s+/g, '_'));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Column Visibility
          </Typography>
          <List dense>
            {columns.map((column) => (
              <ListItem key={column.id} disablePadding>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={column.visible}
                      onChange={() => handleToggleVisibility(column.id)}
                    />
                  }
                  label={`${column.label} (${column.type})`}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Add New Column
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Column ID"
              value={newColumn.id}
              onChange={(e) => setNewColumn({ ...newColumn, id: e.target.value })}
              placeholder="e.g., salary, phone"
              helperText="Used as the data field identifier (will be converted to lowercase with underscores)"
            />
            <TextField
              label="Column Label"
              value={newColumn.label}
              onChange={(e) => setNewColumn({ ...newColumn, label: e.target.value })}
              placeholder="e.g., Salary, Phone Number"
              helperText="Display name shown in the table header"
            />
            <FormControl>
              <InputLabel>Data Type</InputLabel>
              <Select
                value={newColumn.type}
                label="Data Type"
                onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value as any })}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={handleAddColumn}
          variant="contained"
          disabled={isAddDisabled}
        >
          Add Column
        </Button>
      </DialogActions>
    </Dialog>
  );
}