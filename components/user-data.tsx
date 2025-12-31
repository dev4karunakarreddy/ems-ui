import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Link,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

import CreateUser from './create-user';
import { useCreateUser, useGetAllUsers } from './hooks/useCreateUser';

type Mode = 'create' | 'edit' | 'view';

interface Employee {
  id: any;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  role: 'Admin' | 'Lead' | 'User';
}

export default function UserData() {
  // FIX: Properly use the query hook
  const { 
    data: users = [], 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGetAllUsers();
  
  const [rows, setRows] = React.useState<Employee[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { mutate, isPending } = useCreateUser();

  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<Mode>('create');
  const [selectedUser, setSelectedUser] = React.useState<Employee | null>(null);

  // FIX: Update rows when users data changes
  React.useEffect(() => {
    if (users && Array.isArray(users)) {
      setRows(users);
    }
  }, [users]);

  const handleCreate = () => {
    setMode('create');
    setSelectedUser(null);
    setOpen(true);
  };

  const handleEdit = (row: Employee) => {
    setMode('edit');
    setSelectedUser(row);
    setOpen(true);
  };

  const handleView = (row: Employee) => {
    setMode('view');
    setSelectedUser(row);
    setOpen(true);
  };

  const handleDelete = (id: any) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    console.log(`User deleted: ${id}`);
  };

  const handleSubmit = (data: Employee) => {
    if (mode === 'create') {
      // FIX: Call mutate with the data
      mutate(data, {
        onSuccess: () => {
          // The query will be automatically refetched due to invalidateQueries
          setOpen(false);
        },
        onError: (error) => {
          console.error('Failed to create user:', error);
        }
      });
    }

    if (mode === 'edit') {
      // TODO: Add update API call here
      setRows((prev) =>
        prev.map((r) => (r.id === data.id ? data : r))
      );
      console.log('User updated:', data.id);
      setOpen(false);
    }

    if (mode === 'view') {
      setOpen(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        Error loading users: {error?.message || 'Unknown error'}
      </Alert>
    );
  }

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Employees
        </Typography>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>

          <CreateUser
            open={open}
            mode={mode}
            initialData={selectedUser}
            onOpen={handleCreate}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
          />
        </Box>
      </Box>

      <Paper
        sx={{
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        {rows.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography color="textSecondary">
              No users found. Create your first user!
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      '& th': {
                        backgroundColor: '#f5f6f8',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: 13,
                        letterSpacing: 0.4,
                        textTransform: 'uppercase',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      },
                    }}
                  >
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        sx={{
                          height: 56,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            backgroundColor: 'rgba(99,102,241,0.06)',
                          },
                          '& td': {
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>
                          {row.employee_id || row.id}
                        </TableCell>

                        <TableCell>
                          {row.first_name} {row.last_name}
                        </TableCell>

                        <TableCell>
                          <Link
                            href={`mailto:${row.email}`}
                            underline="hover"
                            sx={{ fontWeight: 500 }}
                          >
                            {row.email}
                          </Link>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {row.phone}
                        </TableCell>

                        <TableCell>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              fontSize: 13,
                              fontWeight: 600,
                              display: 'inline-block',
                              backgroundColor:
                                row.role === 'Admin'
                                  ? 'rgba(239,68,68,0.15)'
                                  : row.role === 'Lead'
                                  ? 'rgba(59,130,246,0.15)'
                                  : 'rgba(16,185,129,0.15)',
                            }}
                          >
                            {row.role}
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <IconButton
                            size="small"
                            sx={{
                              mx: 0.5,
                              bgcolor: 'rgba(59,130,246,0.12)',
                              '&:hover': {
                                bgcolor: 'rgba(59,130,246,0.25)',
                              },
                            }}
                            onClick={() => handleEdit(row)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            sx={{
                              mx: 0.5,
                              bgcolor: 'rgba(239,68,68,0.12)',
                              '&:hover': {
                                bgcolor: 'rgba(239,68,68,0.25)',
                              },
                            }}
                            onClick={() => handleDelete(row.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            sx={{
                              mx: 0.5,
                              bgcolor: 'rgba(16,185,129,0.12)',
                              '&:hover': {
                                bgcolor: 'rgba(16,185,129,0.25)',
                              },
                            }}
                            onClick={() => handleView(row)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, p) => setPage(p)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(+e.target.value);
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            />
          </>
        )}
      </Paper>
    </>
  );
}