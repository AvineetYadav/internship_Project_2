'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { useAppDispatch } from '../hooks/useRedux';
import { setData } from '../store/slices/tableSlice';
import { TableRow, ImportError } from '../types';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportDialog({ open, onClose }: ImportDialogProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setErrors([]);
    setSuccess(false);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validationErrors: ImportError[] = [];
        const validRows: TableRow[] = [];

        results.data.forEach((row: any, index: number) => {
          const rowNumber = index + 1;
          const processedRow: Partial<TableRow> = {
            id: Math.random().toString(36).substr(2, 9),
          };

          // Validate required fields
          if (!row.name || typeof row.name !== 'string') {
            validationErrors.push({
              row: rowNumber,
              field: 'name',
              message: 'Name is required and must be text',
            });
          } else {
            processedRow.name = row.name.trim();
          }

          if (!row.email || !row.email.includes('@')) {
            validationErrors.push({
              row: rowNumber,
              field: 'email',
              message: 'Valid email is required',
            });
          } else {
            processedRow.email = row.email.trim();
          }

          if (!row.age || isNaN(Number(row.age))) {
            validationErrors.push({
              row: rowNumber,
              field: 'age',
              message: 'Age must be a valid number',
            });
          } else {
            processedRow.age = Number(row.age);
          }

          if (!row.role || typeof row.role !== 'string') {
            validationErrors.push({
              row: rowNumber,
              field: 'role',
              message: 'Role is required and must be text',
            });
          } else {
            processedRow.role = row.role.trim();
          }

          // Optional fields
          if (row.department) processedRow.department = row.department.trim();
          if (row.location) processedRow.location = row.location.trim();

          // Only add row if no validation errors for this specific row
          const rowHasErrors = validationErrors.some(error => error.row === rowNumber);
          if (!rowHasErrors) {
            validRows.push(processedRow as TableRow);
          }
        });

        setErrors(validationErrors);
        
        if (validationErrors.length === 0) {
          dispatch(setData(validRows));
          setSuccess(true);
          setTimeout(() => {
            onClose();
            setSuccess(false);
          }, 1500);
        }
        
        setImporting(false);
      },
      error: (error) => {
        setErrors([{
          row: 0,
          field: 'file',
          message: 'Failed to parse CSV file: ' + error.message,
        }]);
        setImporting(false);
      },
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setErrors([]);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Import CSV Data</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Upload a CSV file with the following columns: name, email, age, role.
            Optional columns: department, location.
          </Typography>
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          
          <Button
            variant="outlined"
            startIcon={importing ? <CircularProgress size={20} /> : <Upload />}
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            fullWidth
            sx={{ mb: 2 }}
          >
            {importing ? 'Processing...' : 'Choose CSV File'}
          </Button>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Data imported successfully!
          </Alert>
        )}

        {errors.length > 0 && (
          <Box>
            <Alert severity="error" sx={{ mb: 2 }}>
              Found {errors.length} error{errors.length > 1 ? 's' : ''} in the CSV file:
            </Alert>
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {errors.map((error, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Row ${error.row}: ${error.field}`}
                    secondary={error.message}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}