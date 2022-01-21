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

const PositionManagement = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('adminTrade');
    const [positions, setPosition] = useState([]);

    useEffect(() => {
        if (!token) {
            setLoading(true);
            navigate('/login');
        } else {
            fetchAccounts();
        }
        setLoading(false);
    }, [token, navigate]);

    const fetchAccounts = async () => {
        await axios
            .get(`${config.BackendEndpoint}/getPositions`, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                setPosition(res.data.positions);
            })
            .catch((err) => {
                console.log('Error fetching accounts', err);
            });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
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
                        marginBottom: '20px',
                    }}
                >
                    Position Management
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
                    <TableContainer component={Paper} style={{ width: '110%' }}>
                        <Table style={{ backgroundColor: '#f5f5f5' }}>
                            <TableHead>
                                <TableRow
                                    style={{
                                        backgroundColor: 'rgb(13, 191, 150)',
                                        color: '#fff',
                                    }}
                                >
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
                                        Size
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        SymbolName
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        StartPrice
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        StopPrice
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        StopLoss
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        TakeProfit
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Commission
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        RealProfit
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        CloseReason
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        CreatedAt
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {positions &&
                                    positions.map((position) => (
                                        <TableRow key={position.id}>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {position.type}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {position.size}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {position.symbolName}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {position.status}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {position.startPrice}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {position.stopPrice}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {position.stopLoss}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {position.takeProfit}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {position.commission}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {position.realProfit}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {position.closeReason}
                                            </TableCell>
                                            <TableCell
                                                style={{ textAlign: 'center' }}
                                            >
                                                {formatDate(position.createdAt)}
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

export default PositionManagement;
