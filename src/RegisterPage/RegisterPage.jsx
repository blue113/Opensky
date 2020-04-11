import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../_actions';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function RegisterPage() {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const registering = useSelector(state => state.registration.registering);
    const dispatch = useDispatch();

    // reset login status
    useEffect(() => {
        dispatch(userActions.logout());
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setUser(user => ({ ...user, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (user.firstName && user.lastName && user.username && user.password) {
            dispatch(userActions.register(user));
        }
    }

    const classes = useStyles();

    return (
      <div className="jumbotron">
          <div className="container col-md-8 offset-md-2">
              <Grid container component="main">
                <Grid item xs={12} sm={12} md={12} component={Paper} elevation={6} square>
                  <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                      Sign Up
                    </Typography>
                    <form name="form" onSubmit={handleSubmit}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="text"
                        label="User Name"
                        value={user.firstName}
                        onChange={handleChange}
                        name="firstName"
                        autoComplete="username"
                        autoFocus
                      />
                      {submitted && !user.firstName &&
                          <div className="invalid-feedback">First Name is required</div>
                      }
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="text"
                        label="User Name"
                        value={user.lastName}
                        onChange={handleChange}
                        name="lastName"
                        autoComplete="username"
                        autoFocus
                      />
                      {submitted && !user.lastName &&
                          <div className="invalid-feedback">Last Name is required</div>
                      }
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="text"
                        label="User Name"
                        value={user.username}
                        onChange={handleChange}
                        name="username"
                        autoComplete="username"
                        autoFocus
                      />
                      {submitted && !user.username &&
                          <div className="invalid-feedback">Username is required</div>
                      }
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        value={user.password}
                        onChange={handleChange}
                        id="password"
                        autoComplete="current-password"
                      />
                      {submitted && !user.password &&
                          <div className="invalid-feedback">Password is required</div>
                      }
                      <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Sign up
                      </Button>
                      <Grid container>
                        <Grid item xs>
                          <Link href="#" variant="body2">
                            Forgot password?
                          </Link>
                        </Grid>
                        <Grid item>
                          <Link href="login" variant="body2">
                            {"Have account?"}
                          </Link>
                        </Grid>
                      </Grid>
                      <Box mt={5}>
                        <Copyright />
                      </Box>
                    </form>
                  </div>
                </Grid>
              </Grid>
          </div>
      </div>
    );

}

export { RegisterPage };
