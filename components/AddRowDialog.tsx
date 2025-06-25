'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { addRow } from '../store/slices/tableSlice';
import { TableRow } from '../types';

interface AddRowDialogProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
  [key: string]: string | number | undefined;
}

export default function AddRowDialog({ open, onClose }: AddRowDialogProps) {
  const dispatch = useAppDispatch();
  const { columns } = useAppSelector((state) => state.table);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      age: 0,
      role: '',
      department: '',
      location: '',
    },
  });

  const onSubmit = (data: FormData) => {
    const newRow: TableRow = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
    };
    
    dispatch(addRow(newRow));
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const editableColumns = columns.filter(col => col.editable);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Row</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {editableColumns.map((column) => (
              <Grid item xs={12} sm={6} key={column.id}>
                <Controller
                  name={column.id as keyof FormData}
                  control={control}
                  rules={{
                    required: column.required ? `${column.label} is required` : false,
                    pattern: column.type === 'email' ? {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email',
                    } : undefined,
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={column.label}
                      type={column.type === 'number' ? 'number' : 'text'}
                      fullWidth
                      error={!!errors[column.id as keyof FormData]}
                      helperText={errors[column.id as keyof FormData]?.message}
                      InputProps={{
                        inputProps: column.type === 'number' ? { min: 0 } : {},
                      }}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add Row
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}