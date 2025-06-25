'use client';

import { useState } from 'react';
import { Container, Box, Typography, Fade } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { stopAllEditing } from '../store/slices/tableSlice';
import { exportToCSV } from '../utils/csvExport';
import TableToolbar from '../components/TableToolbar';
import DataTable from '../components/DataTable';
import ManageColumnsDialog from '../components/ManageColumnsDialog';
import ImportDialog from '../components/ImportDialog';
import AddRowDialog from '../components/AddRowDialog';

export default function Home() {
  const dispatch = useAppDispatch();
  const { data, columns, searchQuery } = useAppSelector((state) => state.table);
  const [manageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [addRowDialogOpen, setAddRowDialogOpen] = useState(false);

  const handleExport = () => {
    // Filter data based on search query if present
    let dataToExport = data;
    if (searchQuery) {
      const visibleColumns = columns.filter(col => col.visible);
      dataToExport = data.filter(row => {
        const searchLower = searchQuery.toLowerCase();
        return visibleColumns.some(col => {
          const value = row[col.id];
          return value && value.toString().toLowerCase().includes(searchLower);
        });
      });
    }
    
    exportToCSV(dataToExport, columns, 'data-export.csv');
  };

  const handleSaveAll = () => {
    // In a real app, this would save to a backend
    dispatch(stopAllEditing());
  };

  return (
    <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      <Fade in timeout={800}>
        <Box>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Dynamic Data Table Manager
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              A powerful, feature-rich data management interface with sorting, filtering,
              inline editing, and CSV import/export capabilities.
            </Typography>
          </Box>

          <TableToolbar
            onManageColumns={() => setManageColumnsOpen(true)}
            onImport={() => setImportDialogOpen(true)}
            onExport={handleExport}
            onAddRow={() => setAddRowDialogOpen(true)}
            onSaveAll={handleSaveAll}
          />

          <DataTable />

          <ManageColumnsDialog
            open={manageColumnsOpen}
            onClose={() => setManageColumnsOpen(false)}
          />

          <ImportDialog
            open={importDialogOpen}
            onClose={() => setImportDialogOpen(false)}
          />

          <AddRowDialog
            open={addRowDialogOpen}
            onClose={() => setAddRowDialogOpen(false)}
          />
        </Box>
      </Fade>
    </Container>
  );
}