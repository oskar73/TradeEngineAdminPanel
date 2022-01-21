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

const Leverage = ({ setOpenSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('adminTrade');
    const [leverages, setLeverages] = useState([]);

    // Modal States
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedLeverage, setSelectedLeverage] = useState({});

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (!token) {
            setLoading(true);
            navigate('/login');
        } else {
            fetchLeverage();
        }
        setLoading(false);
        //eslint-disable-next-line
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

    const fetchLeverage = async () => {
        await axios
            .get(`${config.BackendEndpoint}/getLeverages`, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                // console.log('asdfasdfasd', typeof res.data.leverages[1].Forex);
                setLeverages(res.data.leverages);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    };

    const handleEditLeverage = (leverage) => {
        leverage = { ...leverage, leverageId: leverage.id };
        setOpenEditModal(true);
        setSelectedLeverage(leverage);
        console.log('------', leverage);
    };

    const handleUpdateLeverage = async () => {
        // Logic for updating leverage information
        await axios
            .post(
                `${config.BackendEndpoint}/updateLeverage`,
                {
                    ...selectedLeverage,
                },
                {
                    headers: {
                        Authorization: token ? token : '',
                    },
                }
            )
            .then((res) => {
                fetchLeverage();
                showSnackbar(res.data.message, 'success');
            })
            .catch((error) => {
                const status = error.response.status;
                const errorMessage = error.response.data.state;
                if (status === 401) {
                    showSnackbar(errorMessage, 'error');
                    navigate('/login');
                    localStorage.removeItem('adminTrade');
                    setOpenSidebar(false);
                }
            });

        setOpenEditModal(false);
        setSelectedLeverage(null); // Clear selected leverage
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
                        leverage Management
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
                    ) : leverages.length > 0 ? ( // Ensure leverage is not empty
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
                                    {leverages.map((leverage) => (
                                        <TableRow key={leverage.id}>
                                            <TableCell>
                                                {leverage.companyEmail}
                                            </TableCell>
                                            <TableCell>
                                                1 : {leverage.Crypto}
                                            </TableCell>
                                            <TableCell>
                                                1 : {leverage.Forex}
                                            </TableCell>
                                            <TableCell>
                                                1 : {leverage.Indices}
                                            </TableCell>
                                            <TableCell>
                                                1 : {leverage.Futures}
                                            </TableCell>

                                            <TableCell>
                                                {formatDate(leverage.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(leverage.updatedAt)}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                <IconButton
                                                    onClick={() =>
                                                        handleEditLeverage(
                                                            leverage
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
                            No leverage found.
                        </Typography>
                    )}
                </Box>

                {/* Edit leverage Modal */}
                <Dialog
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                >
                    <DialogTitle>Edit leverage</DialogTitle>
                    <DialogContent>
                        {selectedLeverage && (
                            <>
                                <TextField
                                    autoFocus
                                    disabled
                                    margin="dense"
                                    label="companyEmail"
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    value={selectedLeverage.companyEmail}
                                    onChange={(e) =>
                                        setSelectedLeverage({
                                            ...selectedLeverage,
                                            companyEmail: e.target.value,
                                        })
                                    }
                                />
                                <p style={{ fontFamily: 'sans-serif' }}>
                                    Forex
                                </p>
                                <Select
                                    labelId="Forex"
                                    value={selectedLeverage.Forex}
                                    onChange={(e) => {
                                        setSelectedLeverage({
                                            ...selectedLeverage,
                                            Forex: e.target.value,
                                        });
                                    }}
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    {/* Leverage options */}
                                    <MenuItem value={1}>1:1</MenuItem>
                                    <MenuItem value={10}>1:10</MenuItem>
                                    <MenuItem value={20}>1:20</MenuItem>
                                    <MenuItem value={30}>1:30</MenuItem>
                                    <MenuItem value={40}>1:40</MenuItem>
                                    <MenuItem value={50}>1:50</MenuItem>
                                    <MenuItem value={60}>1:60</MenuItem>
                                    <MenuItem value={100}>1:100</MenuItem>
                                    <MenuItem value={200}>1:200</MenuItem>
                                    <MenuItem value={500}>1:500</MenuItem>
                                    <MenuItem value={1000}>1:1000</MenuItem>
                                </Select>
                                <p style={{ fontFamily: 'sans-serif' }}>
                                    Indices
                                </p>
                                <Select
                                    labelId="Indices"
                                    value={selectedLeverage.Indices}
                                    onChange={(e) => {
                                        setSelectedLeverage({
                                            ...selectedLeverage,
                                            Indices: e.target.value,
                                        });
                                    }}
                                    style={{ width: '100%' }}
                                >
                                    {/* Leverage options */}
                                    <MenuItem value={1}>1:1</MenuItem>
                                    <MenuItem value={10}>1:10</MenuItem>
                                    <MenuItem value={20}>1:20</MenuItem>
                                    <MenuItem value={30}>1:30</MenuItem>
                                    <MenuItem value={40}>1:40</MenuItem>
                                    <MenuItem value={50}>1:50</MenuItem>
                                    <MenuItem value={60}>1:60</MenuItem>
                                    <MenuItem value={100}>1:100</MenuItem>
                                    <MenuItem value={200}>1:200</MenuItem>
                                    <MenuItem value={500}>1:500</MenuItem>
                                    <MenuItem value={1000}>1:1000</MenuItem>
                                </Select>
                                <p style={{ fontFamily: 'sans-serif' }}>
                                    Crypto
                                </p>
                                <Select
                                    labelId="Crypto"
                                    value={selectedLeverage.Crypto}
                                    onChange={(e) => {
                                        setSelectedLeverage({
                                            ...selectedLeverage,
                                            Crypto: e.target.value,
                                        });
                                    }}
                                    style={{ width: '100%' }}
                                >
                                    {/* Leverage options */}
                                    <MenuItem value={1}>1:1</MenuItem>
                                    <MenuItem value={10}>1:10</MenuItem>
                                    <MenuItem value={20}>1:20</MenuItem>
                                    <MenuItem value={30}>1:30</MenuItem>
                                    <MenuItem value={40}>1:40</MenuItem>
                                    <MenuItem value={50}>1:50</MenuItem>
                                    <MenuItem value={60}>1:60</MenuItem>
                                    <MenuItem value={100}>1:100</MenuItem>
                                    <MenuItem value={200}>1:200</MenuItem>
                                    <MenuItem value={500}>1:500</MenuItem>
                                    <MenuItem value={1000}>1:1000</MenuItem>
                                </Select>
                                <p style={{ fontFamily: 'sans-serif' }}>
                                    Futures
                                </p>
                                <Select
                                    labelId="Futures"
                                    value={selectedLeverage.Futures}
                                    onChange={(e) => {
                                        setSelectedLeverage({
                                            ...selectedLeverage,
                                            Futures: e.target.value,
                                        });
                                    }}
                                    style={{ width: '100%' }}
                                >
                                    {/* Leverage options */}
                                    <MenuItem value={1}>1:1</MenuItem>
                                    <MenuItem value={10}>1:10</MenuItem>
                                    <MenuItem value={20}>1:20</MenuItem>
                                    <MenuItem value={30}>1:30</MenuItem>
                                    <MenuItem value={40}>1:40</MenuItem>
                                    <MenuItem value={50}>1:50</MenuItem>
                                    <MenuItem value={60}>1:60</MenuItem>
                                    <MenuItem value={100}>1:100</MenuItem>
                                    <MenuItem value={200}>1:200</MenuItem>
                                    <MenuItem value={500}>1:500</MenuItem>
                                    <MenuItem value={1000}>1:1000</MenuItem>
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
                        <Button onClick={handleUpdateLeverage} color="primary">
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

export default Leverage;
