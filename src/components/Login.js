import React, { useEffect, useState } from 'react';  
import { useDispatch, useSelector } from 'react-redux';  
import { loginUser } from '../features/authThunks';  
import {  
  TextField,  
  Button,  
  Container,  
  Typography,  
  Box,  
  Snackbar,  
  Grid,  
  InputAdornment,  
} from '@mui/material';  
import MuiAlert from '@mui/material/Alert';  
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import icons  
import backgroundImage from '../assets/background1.png'; // Adjust this path to your actual image location  
import { useNavigate } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {  
  return <MuiAlert elevation={6} ref={ref} {...props} />;  
});  

const Login = () => {  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  
  const [showPassword, setShowPassword] = useState(false); // State for password visibility  
  const [openSnackbar, setOpenSnackbar] = useState(false);  
  const dispatch = useDispatch();  
  const navigate = useNavigate();
  const {error, isAuthenticated} = useSelector((state) => state.auth);  

  const handleSubmit = async (e) => {  
    e.preventDefault();  
    dispatch(loginUser({email, password})); 
  };  

  const handleCloseSnackbar = (event, reason) => {  
    if (reason === 'clickaway') {  
      return;  
    }  
    setOpenSnackbar(false);  
  };  

  useEffect(() => {
    if(isAuthenticated) {
      console.log("this is a authenticated", isAuthenticated);
      navigate('/userManagement');
    }
  }, [isAuthenticated, navigate])

  return (  
    <Container  
      maxWidth="false"  
      sx={{  
        height: '100vh',  
        display: 'flex',  
        alignItems: 'center',  
        justifyContent: 'center',  
        backgroundImage: `url(${backgroundImage})`,  
        backgroundSize: 'cover',  
        backgroundPosition: 'center',  
        position: 'relative',  
        overflow: 'hidden',  
      }}  
    >  
      <Box  
        sx={{  
          width: '100%',  
          maxWidth: 400,  
          p: 2,  
          boxShadow: 3,  
          borderRadius: 1,  
          backgroundColor: 'rgba(255, 255, 255, 0.8)',  
        }}  
      >  
        <Typography variant="h4" align="center" gutterBottom>  
          Login  
        </Typography>  
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>  
          <Grid container spacing={2}>  
            <Grid item xs={12}>  
              <TextField  
                label="Email"  
                variant="outlined"  
                fullWidth  
                margin="normal"  
                value={email}  
                type='email'
                onChange={(e) => setEmail(e.target.value)}  
                required  
              />  
            </Grid>    
            <Grid item xs={12}>  
              <TextField  
                label="Password"  
                type={showPassword ? 'text' : 'password'} // Toggle password visibility  
                variant="outlined"  
                fullWidth  
                margin="normal"  
                value={password}  
                onChange={(e) => setPassword(e.target.value)}  
                required  
                InputProps={{  
                  endAdornment: (  
                    <InputAdornment position="end">  
                      <Button onClick={() => setShowPassword(!showPassword)} style={{ padding: 0 }}>  
                        {showPassword ? <VisibilityOff /> : <Visibility />}  
                      </Button>  
                    </InputAdornment>  
                  ),  
                }}  
              />  
            </Grid>  
            <Grid item xs={12}>  
              <Button  
                type="submit"  
                variant="contained"  
                color="primary"  
                fullWidth  
                sx={{ mt: 2 }}  
              >  
                Login  
              </Button>  
            </Grid>  
          </Grid>  
        </Box>  
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>  
          <Alert onClose={handleCloseSnackbar} severity="error">  
            {error}  
          </Alert>  
        </Snackbar>  
      </Box>  
    </Container>  
  );  
};  

export default Login;