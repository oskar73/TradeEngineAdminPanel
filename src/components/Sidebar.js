import React from 'react';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Drawer,
    Box,
    Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Group, EuroSymbol, MoneyTwoTone } from '@mui/icons-material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExitToApp from '@mui/icons-material/ExitToApp';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import FunctionsIcon from '@mui/icons-material/Functions';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import logo from '../assets/logo.png';

const Sidebar = ({ open, onClose, setOpenSidebar }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Determine selected item based on current location
    const selectedItem = location.pathname;

    const handleNavigation = (path) => {
        navigate(path); // Navigate to the new path using react-router
        // onClose(); // If you want to close it, uncomment this line
    };

    const handleLogout = () => {
        setOpenSidebar(false);
        dispatch(logout());
        localStorage.removeItem('adminTrade');
        navigate('/login');
    };

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={{
                width: open ? 240 : 0,
                '& .MuiDrawer-paper': {
                    width: open ? 240 : 0,
                    boxSizing: 'border-box',
                    transition: 'width 0.3s',
                    overflowX: 'hidden', // Prevent horizontal overflow
                },
            }}
        >
            <img src={logo} alt="Logo" height={240} width={240} />
            <List>
                <ListItem
                    onClick={() => handleNavigation('/userManagement')}
                    selected={selectedItem === '/userManagement'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }}
                >
                    <ListItemIcon>
                        <Group />
                    </ListItemIcon>
                    <ListItemText
                        primary="Users"
                        style={{
                            fontWeight:
                                selectedItem === '/userManagement'
                                    ? 'bold'
                                    : 'normal',
                        }}
                    />
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation('/companyManagement')}
                    selected={selectedItem === '/companyManagement'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }}
                >
                    <ListItemIcon>
                        <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Company"
                        style={{
                            fontWeight:
                                selectedItem === '/companyManagement'
                                    ? 'bold'
                                    : 'normal',
                        }}
                    />
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation('/symbolManagement')}
                    selected={selectedItem === '/symbolManagement'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }}
                >
                    <ListItemIcon>
                        <EuroSymbol />
                    </ListItemIcon>
                    <ListItemText
                        primary="Symbol"
                        style={{
                            fontWeight:
                                selectedItem === '/symbolManagement'
                                    ? 'bold'
                                    : 'normal',
                        }}
                    />
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation('/positionManagement')}
                    selected={selectedItem === '/positionManagement'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }}
                >
                    <ListItemIcon>
                        <MoneyTwoTone />
                    </ListItemIcon>
                    <ListItemText
                        primary="Position"
                        style={{
                            fontWeight:
                                selectedItem === '/positionManagement'
                                    ? 'bold'
                                    : 'normal',
                        }}
                    />
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation('/symbolAssets')}
                    selected={selectedItem === '/symbolAssets'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }}
                >
                    <ListItemIcon>
                        <FunctionsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Symbol Assets" />
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation('/commission')}
                    selected={selectedItem === '/commission'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }}
                >
                    <ListItemIcon>
                        <MonetizationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary="Commission" />
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation('/leverage')}
                    selected={selectedItem === '/leverage'}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }}
                >
                    <ListItemIcon>
                        <TrendingUpIcon />
                    </ListItemIcon>
                    <ListItemText primary="Leverage" />
                </ListItem>
                <Divider />
                <ListItem
                    onClick={handleLogout}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            borderRight: 'solid 10px #1976D2',
                        },
                    }}
                >
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="Log Out" />
                </ListItem>
            </List>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 2,
                }}
            ></Box>
        </Drawer>
    );
};

export default Sidebar;
