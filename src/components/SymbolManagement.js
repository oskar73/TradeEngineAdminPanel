import React, { useEffect, useState, useCallback } from 'react';
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
    Snackbar,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const SymbolManagement = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('adminTrade');
    const [symbols, setSymbol] = useState([]);
    const [assetNames, setAssetName] = useState([]);

    // Modal States
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [newSymbol, setNewSymbol] = useState({
        name: '',
        type: '',
        code: '',
        assetName: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchSymbols = useCallback(async () => {
        await axios
            .get(`${config.BackendEndpoint}/getSymbols`, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                setSymbol(res.data.symbols);
                setAssetName(res.data.assetNames);
            })
            .catch((err) => {
                console.log('Error fetching symbols', err);
            });
    }, [token]);

    useEffect(() => {
        if (!token) {
            setLoading(true);
            navigate('/login');
        } else {
            fetchSymbols();
        }
        setLoading(false);

        // eslint-disable-next-line
    }, [token, navigate]);
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

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    };

    const validate = () => {
        const tempErrors = {};
        if (!newSymbol.name) {
            tempErrors.name = 'Name is required';
        }
        if (!newSymbol.type) {
            tempErrors.type = 'Type is required';
        }
        if (!newSymbol.code) {
            tempErrors.code = 'Code is required';
        }
        if (!newSymbol.assetName) {
            tempErrors.assetName = 'Asset Name is required';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleCreateSymbol = async () => {
        if (validate()) {
            // Reset the form
            await axios
                .post(`${config.BackendEndpoint}/createSymbol`, newSymbol, {
                    headers: {
                        Authorization: token ? token : '',
                    },
                })
                .then((res) => {
                    fetchSymbols();
                    showSnackbar(res.data.message, 'success');
                    setNewSymbol({
                        name: '',
                        code: '',
                        type: '',
                        assetName: '',
                    });
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
        symbol = { ...symbol, symbolId: symbol.id };
        setOpenEditModal(true);
        setSelectedSymbol(symbol);
    };

    const handleUpdateSymbol = async () => {
        // Logic for updating symbol information
        await axios
            .post(
                `${config.BackendEndpoint}/updateSymbol`,
                {
                    ...selectedSymbol,
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
        setSelectedSymbol(null); // Clear selected symbol
    };

    const handleDeleteSymbol = async () => {
        await axios
            .post(
                `${config.BackendEndpoint}/deleteSymbol`,
                { symbolId: selectedSymbol.id },
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
        setSelectedSymbol(symbol);
        setOpenDeleteModal(true);
    };

    const handleNewUserChange = (field, value) => {
        setNewSymbol((prev) => ({ ...prev, [field]: value }));

        // Clear specific error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
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
                        Symbol Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateModal(true)}
                        style={{ marginBottom: '20px', marginTop: '20px' }}
                    >
                        Create Symbol
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
                    ) : symbols.length > 0 ? ( // Ensure symbols is not empty
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
                                            Type
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                color: '#fff',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Code
                                        </TableCell>

                                        <TableCell
                                            style={{
                                                color: '#fff',
                                                textAlign: 'center',
                                            }}
                                        >
                                            AssetName
                                        </TableCell>

                                        <TableCell
                                            style={{
                                                color: '#fff',
                                                textAlign: 'center',
                                            }}
                                        >
                                            UpdateAt
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                color: '#fff',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {symbols.map((symbol) => (
                                        <TableRow key={symbol.id}>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {symbol.name}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {symbol.type}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {symbol.code}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {symbol.assetName}
                                            </TableCell>

                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {formatDate(symbol.updatedAt)}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleEditSymbol(symbol)
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="secondary"
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
                        <Typography
                            variant="h6"
                            style={{ textAlign: 'center', marginTop: '20px' }}
                        >
                            No symbols found.
                        </Typography>
                    )}
                </Box>
            </Container>

            {/* Modal for Creating Symbol */}
            <Dialog
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
            >
                <DialogTitle>Create New Symbol</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="dense"
                        value={newSymbol.name}
                        onChange={(e) =>
                            handleNewUserChange('name', e.target.value)
                        }
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Type"
                        fullWidth
                        margin="dense"
                        value={newSymbol.type}
                        onChange={(e) =>
                            handleNewUserChange('type', e.target.value)
                        }
                        error={Boolean(errors.type)}
                        helperText={errors.type}
                    />
                    <TextField
                        label="Code"
                        fullWidth
                        style={{ marginBottom: '10px' }}
                        margin="dense"
                        value={newSymbol.code}
                        onChange={(e) =>
                            handleNewUserChange('code', e.target.value)
                        }
                        error={Boolean(errors.code)}
                        helperText={errors.code}
                    />
                    <Select
                        label="Asset Name"
                        fullWidth
                        margin="dense"
                        value={newSymbol.assetName}
                        onChange={(e) =>
                            handleNewUserChange('assetName', e.target.value)
                        }
                        error={Boolean(errors.assetName)}
                    >
                        <MenuItem value="">Asset Name</MenuItem>
                        {assetNames.map((asset) => (
                            <MenuItem key={asset} value={asset}>
                                {asset}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.assetName && (
                        <Typography
                            color="error"
                            variant="body2"
                            style={{ marginTop: '4px' }}
                        >
                            {errors.assetName}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenCreateModal(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleCreateSymbol} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal for Editing Symbol */}
            <Dialog
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
            >
                <DialogTitle>Edit Symbol</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="dense"
                        value={selectedSymbol?.name || ''}
                        onChange={(e) =>
                            setSelectedSymbol((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Type"
                        fullWidth
                        margin="dense"
                        value={selectedSymbol?.type || ''}
                        onChange={(e) =>
                            setSelectedSymbol((prev) => ({
                                ...prev,
                                type: e.target.value,
                            }))
                        }
                        error={Boolean(errors.type)}
                        helperText={errors.type}
                    />
                    <TextField
                        label="Code"
                        fullWidth
                        margin="dense"
                        value={selectedSymbol?.code || ''}
                        onChange={(e) =>
                            setSelectedSymbol((prev) => ({
                                ...prev,
                                code: e.target.value,
                            }))
                        }
                        error={Boolean(errors.code)}
                        helperText={errors.code}
                    />
                    <Select
                        label="Asset Name"
                        fullWidth
                        margin="dense"
                        value={selectedSymbol?.assetName || ''}
                        onChange={(e) =>
                            setSelectedSymbol((prev) => ({
                                ...prev,
                                assetName: e.target.value,
                            }))
                        }
                        error={Boolean(errors.assetName)}
                    >
                        {assetNames.map((asset) => (
                            <MenuItem key={asset} value={asset}>
                                {asset}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.assetName && (
                        <Typography
                            color="error"
                            variant="body2"
                            style={{ marginTop: '4px' }}
                        >
                            {errors.assetName}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenEditModal(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateSymbol} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal for Confirming Deletion */}
            <Dialog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this symbol?
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDeleteModal(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteSymbol} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default SymbolManagement;
