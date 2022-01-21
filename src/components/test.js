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
} from '@mui/material';

const SymbolManagement = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('adminTrade');
    const [symbols, setSymbol] = useState([]);

    useEffect(() => {
        if (!token) {
            setLoading(true);
            navigate('/login');
        } else {
            fetchSymbols();
        }
        setLoading(false);
    }, [token, navigate]);

    const fetchSymbols = async () => {
        await axios
            .get(`${config.BackendEndpoint}/getSymbols`, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                setSymbol(res.data.symbols);
            })
            .catch((err) => {
                console.log('Error fetching accounts', err);
            });
    };

    return (
        <Container
            style={{ marginTop: '30px', width: '100%', textAlign: 'center' }}
        >
            <Box flexGrow={1}>
                <Typography
                    variant="h4"
                    style={{
                        marginLeft: '10%',
                        color: 'white',
                        fontFamily: 'nycd',
                        fontWeight: '1000',
                    }}
                >
                    Symbol Management
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
                ) : (
                    <TableContainer component={Paper} style={{ width: '100%' }}>
                        <Table style={{ backgroundColor: '#f5f5f5' }}>
                            <TableHead>
                                <TableRow
                                    style={{
                                        backgroundColor: 'rgb(13, 191, 150)',
                                        color: '#fff',
                                    }}
                                >
                                    <TableCell style={{ color: '#fff' }}>
                                        Name
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Type
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Code
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        PipSize
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        CreateAt
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {symbols &&
                                    symbols.map((symbol) => (
                                        <TableRow key={symbol.id}>
                                            <TableCell>{symbol.name}</TableCell>
                                            <TableCell>{symbol.type}</TableCell>
                                            <TableCell>{symbol.code}</TableCell>
                                            <TableCell>
                                                {symbol.pip_size}
                                            </TableCell>
                                            <TableCell>
                                                {symbol.createdAt}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Container>
    );
};

export default SymbolManagement;
