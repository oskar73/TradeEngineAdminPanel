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
    Snackbar,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Commission = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('adminTrade');
    const [commissions, setCommissions] = useState([]);

    // Modal States
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedCommission, setSelectedCommission] = useState(null);
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (!token) {
            setLoading(true);
            navigate('/login');
        } else {
            fetchCommission();
        }
        setLoading(false);
    }, [token]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Example function to show a snackbar (call this where needed)
    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const fetchCommission = async () => {
        await axios
            .get(`${config.BackendEndpoint}/getCommissions`, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                setCommissions(res.data.commissions);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    };

    const handleEditCommission = (commission) => {
        commission = { ...commission, commissionId: commission.id };
        setOpenEditModal(true);
        setSelectedCommission(commission);
    };

    const handleUpdateCommission = async () => {
        // Logic for updating commission information
        await axios
            .post(
                `${config.BackendEndpoint}/updateCommission`,
                {
                    ...selectedCommission,
                },
                {
                    headers: {
                        Authorization: token ? token : '',
                    },
                }
            )
            .then((res) => {
                fetchCommission();
                showSnackbar(res.data.message, 'success');
            })
            .catch((error) => {
                const errorMessage =
                    error.response?.data?.message || 'An error occurred';
                showSnackbar(errorMessage, 'error');
            });

        setOpenEditModal(false);
        setSelectedCommission(null); // Clear selected commission
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
                            marginBottom: '30px',
                        }}
                    >
                        Commission Management
                    </Typography>

                    {loading ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="200px"
                        >
                            <CircularProgress />
                        </Box>
                    ) : commissions.length > 0 ? ( // Ensure commission is not empty
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
                                        <TableCell style={{ color: '#fff' }}>
                                            CompanyEmail
                                        </TableCell>
                                        <TableCell style={{ color: '#fff' }}>
                                            Crypto
                                        </TableCell>
                                        <TableCell style={{ color: '#fff' }}>
                                            Forex
                                        </TableCell>

                                        <TableCell style={{ color: '#fff' }}>
                                            Indices
                                        </TableCell>
                                        <TableCell style={{ color: '#fff' }}>
                                            Futures
                                        </TableCell>

                                        <TableCell style={{ color: '#fff' }}>
                                            CreatedAt
                                        </TableCell>
                                        <TableCell style={{ color: '#fff' }}>
                                            UpdatedAt
                                        </TableCell>

                                        <TableCell style={{ color: '#fff' }}>
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {commissions.map((commission) => (
                                        <TableRow key={commission.id}>
                                            <TableCell>
                                                {commission.companyEmail}
                                            </TableCell>
                                            <TableCell>
                                                {commission.Crypto}
                                            </TableCell>
                                            <TableCell>
                                                {commission.Forex}
                                            </TableCell>
                                            <TableCell>
                                                {commission.Indices}
                                            </TableCell>
                                            <TableCell>
                                                {commission.Futures}
                                            </TableCell>

                                            <TableCell>
                                                {formatDate(
                                                    commission.createdAt
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(
                                                    commission.updatedAt
                                                )}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                <IconButton
                                                    onClick={() =>
                                                        handleEditCommission(
                                                            commission
                                                        )
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="h6" style={{ color: 'white' }}>
                            No commission found.
                        </Typography>
                    )}
                </Box>

                {/* Edit commission Modal */}
                <Dialog
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                >
                    <DialogTitle>Edit Commission</DialogTitle>
                    <DialogContent>
                        {selectedCommission && (
                            <>
                                <TextField
                                    margin="dense"
                                    label="Crypto"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCommission.Crypto}
                                    onChange={(e) =>
                                        setSelectedCommission({
                                            ...selectedCommission,
                                            Crypto: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <TextField
                                    margin="dense"
                                    label="Forex"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCommission.Forex}
                                    onChange={(e) =>
                                        setSelectedCommission({
                                            ...selectedCommission,
                                            Forex: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <TextField
                                    margin="dense"
                                    label="Indices"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCommission.Indices}
                                    onChange={(e) =>
                                        setSelectedCommission({
                                            ...selectedCommission,
                                            Indices: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <TextField
                                    margin="dense"
                                    label="Futures"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCommission.Futures}
                                    onChange={(e) =>
                                        setSelectedCommission({
                                            ...selectedCommission,
                                            Futures: e.target.value,
                                        })
                                    }
                                    required
                                />
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
                        <Button
                            onClick={handleUpdateCommission}
                            color="primary"
                        >
                            Update
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

export default Commission;
