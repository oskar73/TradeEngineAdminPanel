import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from './config';
import { useNavigate } from 'react-router-dom';

import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Paper,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Select,
    MenuItem,
    OutlinedInput,
    Snackbar,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const SymbolAssets = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('adminTrade');
    const [assets, setAssets] = useState([]);

    // Modal States
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [newAsset, setNewAsset] = useState({
        name: '',
        pip_size: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (!token) {
            setLoading(true);
            navigate('/login');
        } else {
            fetchSymbols();
        }
        setLoading(false);
        // eslint-disable-next-line
    }, [token]);

    const fetchSymbols = async () => {
        await axios
            .get(`${config.BackendEndpoint}/getAssets`, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                setAssets(res.data.assets);
            })
            .catch((err) => {
                console.log('Error fetching assets', err);
            });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    };
    const handleNewUserChange = (field, value) => {
        setNewAsset((prev) => ({ ...prev, [field]: value }));

        // Clear specific error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const tempErrors = {};
        if (!newAsset.name) {
            tempErrors.name = 'Name is required';
        }

        // Check if password is strong
        if (!newAsset.pip_size) {
            tempErrors.pip_size = 'Pip size is required';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Function to handle closing the Snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Example function to show a snackbar (call this where needed)
    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCreateSymbol = async () => {
        if (validate()) {
            // Reset the form
            await axios
                .post(`${config.BackendEndpoint}/createAsset`, newAsset, {
                    headers: {
                        Authorization: token ? token : '',
                    },
                })
                .then((res) => {
                    fetchSymbols();
                    showSnackbar(res.data.message, 'success');
                    setNewAsset({
                        name: '',
                        pip_size: '',
                    });
                    setErrors({});
                })
                .catch((error) => {
                    const errorMessage =
                        error.response?.data?.message || 'An error occurred';
                    showSnackbar(errorMessage, 'error');
                });
            setOpenCreateModal(false);
        }
    };

    const handleEditSymbol = (symbol) => {
        symbol = { ...symbol, assetId: symbol.id };
        setSelectedAsset(symbol);
        setOpenEditModal(true);
    };

    const handleUpdateSymbol = async () => {
        // Logic for updating symbol information
        await axios
            .post(
                `${config.BackendEndpoint}/updateAsset`,
                {
                    ...selectedAsset,
                },
                {
                    headers: {
                        Authorization: token ? token : '',
                    },
                }
            )
            .then((res) => {
                fetchSymbols();
                showSnackbar(res.data.message, 'success');
            })
            .catch((error) => {
                const errorMessage =
                    error.response?.data?.message || 'An error occurred';
                showSnackbar(errorMessage, 'error');
            });
        setOpenCreateModal(false);
        setOpenEditModal(false);
        setSelectedAsset(null); // Clear selected symbol
    };

    const handleDeleteSymbol = async () => {
        await axios
            .post(
                `${config.BackendEndpoint}/deleteAsset`,
                { assetId: selectedAsset.id },
                {
                    headers: {
                        Authorization: token ? token : '',
                    },
                }
            )
            .then((res) => {
                fetchSymbols();
                showSnackbar(res.data.message, 'success');
                setOpenDeleteModal(false);
            })
            .catch((error) => {
                const errorMessage =
                    error.response?.data?.message || 'An error occurred';
                showSnackbar(errorMessage, 'error');
            });
        setOpenCreateModal(false);
    };

    const handleConfirmDelete = (symbol) => {
        // Logic for deleting symbol
        setSelectedAsset(symbol);
        setOpenDeleteModal(true);
    };

    return (
        <>
            <Container
                style={{
                    marginTop: '30px',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <Box
                    flexGrow={1}
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                >
                    <Typography
                        variant="h4"
                        style={{
                            marginLeft: '20vw',
                            color: 'white',
                            fontFamily: 'nycd',
                            fontWeight: '1000',
                        }}
                    >
                        Symbol Assets
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateModal(true)}
                        style={{ marginBottom: '20px', marginTop: '20px' }}
                    >
                        Create Symbol Asset
                    </Button>

                    {loading ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="200px"
                        >
                            <CircularProgress />
                        </Box>
                    ) : assets.length > 0 ? ( // Ensure accounts is not empty
                        <TableContainer
                            component={Paper}
                            style={{ width: '100%' }}
                        >
                            <Table style={{ backgroundColor: '#f5f5f5' }}>
                                <TableHead>
                                    <TableRow
                                        style={{
                                            backgroundColor:
                                                'rgb(13, 191, 150)',
                                            color: '#fff',
                                        }}
                                    >
                                        <TableCell
                                            style={{
                                                color: '#fff',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Name
                                        </TableCell>

                                        <TableCell
                                            style={{
                                                color: '#fff',
                                                textAlign: 'center',
                                            }}
                                        >
                                            PIP Size
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                color: '#fff',
                                                textAlign: 'center',
                                            }}
                                        >
                                            CreateAt
                                        </TableCell>

                                        <TableCell
                                            style={{
                                                color: '#fff',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assets.map((symbol) => (
                                        <TableRow key={symbol.id}>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {symbol.name}
                                            </TableCell>

                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {symbol.pip_size}
                                            </TableCell>

                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {formatDate(symbol.createdAt)}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                <IconButton
                                                    onClick={() =>
                                                        handleEditSymbol(symbol)
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() =>
                                                        handleConfirmDelete(
                                                            symbol
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="h6" style={{ color: 'white' }}>
                            No symbol asset found.
                        </Typography>
                    )}
                </Box>

                {/* Create symbol Modal */}
                <Dialog
                    open={openCreateModal}
                    onClose={() => {
                        setNewAsset({
                            name: '',
                            pip_size: '',
                        });
                        setErrors({});
                        setOpenCreateModal(false);
                    }}
                >
                    <DialogTitle>Create Asset</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={newAsset.name}
                            onChange={(e) =>
                                handleNewUserChange('name', e.target.value)
                            }
                            error={!!errors.name}
                            helperText={errors.email}
                            required
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            label="PIP size"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={newAsset.pip_size}
                            onChange={(e) =>
                                handleNewUserChange('pip_size', e.target.value)
                            }
                            error={!!errors.pip_size}
                            helperText={errors.pip_size}
                            required
                        />

                        {errors.pip_size && (
                            <Typography color="error">
                                {errors.pip_size}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setNewAsset({
                                    name: '',
                                    pip_size: '',
                                });
                                setErrors({});
                                setOpenCreateModal(false);
                            }}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreateSymbol} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Symbol Modal */}
                <Dialog
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                >
                    <DialogTitle>Edit Asset</DialogTitle>
                    <DialogContent>
                        {selectedAsset && (
                            <>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={selectedAsset.name}
                                    onChange={(e) =>
                                        setSelectedAsset({
                                            ...selectedAsset,
                                            name: e.target.value,
                                        })
                                    }
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    required
                                />
                                <Select
                                    labelId="pip_size"
                                    value={selectedAsset.pip_size}
                                    onChange={(e) => {
                                        setSelectedAsset({
                                            ...selectedAsset,
                                            pip_size: e.target.value,
                                        });
                                    }}
                                    style={{ width: '100%' }}
                                    displayEmpty
                                    input={<OutlinedInput label="" />}
                                    required
                                >
                                    <MenuItem value="">
                                        <span>Select pip size</span>{' '}
                                        {/* Placeholder when nothing is selected */}
                                    </MenuItem>
                                    {/* Leverage options */}
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={0.01}>0.01</MenuItem>
                                    <MenuItem value={0.0001}>0.0001</MenuItem>
                                </Select>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpenEditModal(false)}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateSymbol} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog
                    open={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this symbol?
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpenDeleteModal(false);
                                setNewAsset({
                                    name: '',
                                    pip_size: '',
                                });
                            }}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteSymbol} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000} // Duration to hide automatically
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default SymbolAssets;
