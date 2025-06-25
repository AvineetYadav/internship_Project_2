'use client';

import {
  Toolbar,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Search,
  Add,
  FileDownload,
  Upload,
  Settings,
  Brightness4,
  Brightness7,
  Save,
  Cancel,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { setSearchQuery, stopAllEditing } from '../store/slices/tableSlice';
import { useTheme as useCustomTheme } from '../providers/ThemeProvider';

interface TableToolbarProps {
  onManageColumns: () => void;
  onImport: () => void;
  onExport: () => void;
  onAddRow: () => void;
  onSaveAll: () => void;
}

export default function TableToolbar({
  onManageColumns,
  onImport,
  onExport,
  onAddRow,
  onSaveAll,
}: TableToolbarProps) {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const dispatch = useAppDispatch();
  const { searchQuery, editingRows } = useAppSelector((state) => state.table);

  const hasEditingRows = editingRows.size > 0;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleCancelAll = () => {
    dispatch(stopAllEditing());
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: theme.palette.background.paper,
        borderRadius: 1,
        mb: 2,
        boxShadow: theme.shadows[1],
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            mr: 2, 
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            whiteSpace: 'nowrap',
          }}
        >
          Data Manager
        </Typography>
        
        <TextField
          size="small"
          placeholder="Search all fields..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            minWidth: { xs: 200, md: 300 },
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.action.hover,
              '&:hover': {
                backgroundColor: theme.palette.action.selected,
              },
            },
          }}
        />
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        alignItems: 'center',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        width: { xs: '100%', md: 'auto' },
        justifyContent: { xs: 'flex-end', md: 'normal' },
        mt: { xs: 1, md: 0 },
      }}>
        {hasEditingRows && (
          <>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={onSaveAll}
              size="small"
              sx={{ mr: 1 }}
            >
              Save All
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleCancelAll}
              size="small"
              sx={{ mr: 1 }}
            >
              Cancel All
            </Button>
          </>
        )}
        
        <Tooltip title="Add Row">
          <IconButton onClick={onAddRow} color="primary">
            <Add />
          </IconButton>
        </Tooltip>

        <Tooltip title="Import CSV">
          <IconButton onClick={onImport} color="primary">
            <Upload />
          </IconButton>
        </Tooltip>

        <Tooltip title="Export CSV">
          <IconButton onClick={onExport} color="primary">
            <FileDownload />
          </IconButton>
        </Tooltip>

        <Tooltip title="Manage Columns">
          <IconButton onClick={onManageColumns} color="primary">
            <Settings />
          </IconButton>
        </Tooltip>

        <Tooltip title="Toggle Theme">
          <IconButton onClick={toggleDarkMode} color="primary">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>
      </Box>
    </Toolbar>
  );
}