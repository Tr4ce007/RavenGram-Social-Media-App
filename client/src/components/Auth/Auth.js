import React, { useState ,useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import { GoogleLogin, GoogleLogout } from 'react-google-login'; //Modigied outh
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { gapi } from "gapi-script";//New for outh
import {useHistory} from 'react-router-dom';

import useStyles from './styles';
import Icon from './icon';
import Input from './Input';
import {signin,signup} from '../../actions/auth';

const initialState = {firstName:'', lastName:'', email:'', password:'', confirmPassword:''};

const Auth = () => {

    //New Code for Outh
    useEffect(() => {
        function start() {
          gapi.client.init({
            clientId: '1012250198529-9ov469lngaovajrvce2anqu34pjdjs8m.apps.googleusercontent.com',
            scope: 'email',
          });
        }
    
        gapi.load('client:auth2', start);
      }, []);
      //ends here

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const [formData, setFormData] = useState(initialState);

    const [isSignup,setIsSignup] = useState(false);
    const [showPassword , setShowPassword] = useState(false);

    const handleShowPassword = () => setShowPassword((prevShowPassword)=> !prevShowPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        if(isSignup){
            dispatch(signup(formData,history));
        }else{
            dispatch(signin(formData,history));
        }

    };

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    };

    const switchMode= () =>{
        setIsSignup((prevIsSignup) => !prevIsSignup);
        handleShowPassword(false);
    };

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try{
            dispatch({type:'AUTH', data:{result,token}});
            history.push('/');
        }catch{
            console.log()
        }
    }

    const googleError = (error) => {
        console.log(error);
        alert('Google Sign In was unsuccessful. Try again later');
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{isSignup ? 'Sign up' : 'Sign in'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name='firstName' label = 'First Name' handleChange = {handleChange} autoFocus half />
                                    <Input name='lastName' label = 'Last Name' handleChange = {handleChange} half />
                                </>
                            )                             
                        }
                        <Input name='email' label='Email Address' handleChange={handleChange} type='email' />
                        <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        {isSignup && <Input name='confirmPassword' label='Repeat Password' handleChange={handleChange} type='password' />}
                    </Grid>
                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <GoogleLogin
            clientId="1012250198529-9ov469lngaovajrvce2anqu34pjdjs8m.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
          />
                    <Grid container justify = 'flex-end'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth;