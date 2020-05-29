import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { userActions, skyActions } from '../_actions';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { InputLabel, Select, MenuItem, FormControl } from '@material-ui/core';
import _ from 'lodash';
import icaoData from '../_constants/icao.json';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 400,
  },
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    marginTop: 100,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  modalContent: {
    marginTop: 0,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    overflow: 'auto',
    maxHeight: 500
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  logout: {
    color: '#ffffff'
  },
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  cardTitle: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

function HomePage() {
  const users = useSelector(state => state.users);
  const states = useSelector(state => state.sky);
  const user = useSelector(state => state.authentication.user);
  const [open, setOpen] = React.useState(false);
  const [departing, setDeparting] = React.useState('');
  const [arriving, setArriving] = React.useState('');
  const [allArrialsFlights, setAllArrialsFlights] = React.useState([]);
  const [allDepaturesFlights, setAllDepaturesFlights] = React.useState([]);
  const [lastDeparture, setLastDeparture] = React.useState(0);
  const [lastArrival, setLastArrival] = React.useState(0);
  const [icao, setIcao] = useState('');
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(userActions.getAll());
    dispatch(skyActions.getAllStates());
  }, []);

  const rand = () => {
    return Math.round(Math.random() * 20) - 10;
  }

  const getModalStyle = () => {
    const top = 150;
    const left = 150;

    return {
      top: `${top}%`,
      left: `${left}%`,
    };
  }
  
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const changeDeparting = (e) => {
    let curTimestamp = new Date().getTime() / 1000 | 0;
    let tm = e.target.value;
    let last = curTimestamp - tm * 60 * 60;
    setLastDeparture(last);
    setDeparting(e.target.value);
    getDeparturesByAirport(icao, last, curTimestamp);
  }

  const changeArriving = (e) => {
    let curTimestamp = new Date().getTime() / 1000 | 0;
    let tm = e.target.value;
    let last = curTimestamp - tm * 60 * 60;
    setLastArrival(last);
    setArriving(e.target.value);
    getArrivalsByAirport(icao, last, curTimestamp);
  }

  const body = (
    <div style={modalStyle} className={classes.modalPaper}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-helper-label">departing flights</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={departing}
                onChange={changeDeparting}
              >
                <MenuItem value="">
                </MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={40}>40</MenuItem>
                <MenuItem value={80}>80</MenuItem>
                <MenuItem value={120}>120</MenuItem>
                <MenuItem value={500}>500</MenuItem>
              </Select>
            </FormControl>
            <Container maxWidth="lg" fixed className={classes.modalContent}>
              <Grid container justify="center">
                {
                  allDepaturesFlights && allDepaturesFlights.map((val, key) => {
                    console.log('allDepaturesFlights => ', key);
                    return (val.firstSeen > lastDeparture) && (
                      <Card className={classes.root} variant="outlined" key={key}>
                        <CardContent>
                          <Typography className={classes.cardTitle} color="textSecondary" gutterBottom>
                            ICAO: {val.icao24}
                          </Typography>
                          <Typography variant="h5" component="h2">
                            DepartureAirport: {val.estDepartureAirport}
                          </Typography>
                          <Typography variant="h5" component="h2">
                            ArrivalAirport: {val.estArrivalAirport}
                          </Typography>
                          <Typography variant="body2" component="p">
                            HorizontalDistance : {val.estDepartureAirportHorizDistance}
                          </Typography>
                          <Typography variant="body2" component="p">
                            VerticalDistance : {val.estDepartureAirportVertDistance}
                            <br />
                          </Typography>
                          <Typography variant="body2" component="p">
                            CallSign : {val.callsign}
                            <br />
                          </Typography>
                        </CardContent>
                        {/* <CardActions>
                        <Button size="small" onClick={() => { getCityInfo(value); }}>Flight Info</Button>
                      </CardActions> */}
                      </Card>
                    );
                  })
                }
              </Grid>
            </Container>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-helper-label">arriving flights</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={arriving}
                onChange={changeArriving}
              >
                <MenuItem value="">
                </MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={40}>40</MenuItem>
                <MenuItem value={80}>80</MenuItem>
                <MenuItem value={120}>120</MenuItem>
                <MenuItem value={500}>500</MenuItem>
              </Select>
            </FormControl>
            <Container fixed maxWidth="lg" className={classes.modalContent}>
              <Grid container justify="center">
                {
                  allArrialsFlights && allArrialsFlights.map((val, key) => {
                    console.log('allArrivalFlights => ', key);
                    return (val.lastSeen > lastArrival) && (
                      <Card className={classes.root} variant="outlined" key={key}>
                        <CardContent>
                          <Typography className={classes.cardTitle} color="textSecondary" gutterBottom>
                            ICAO: {val.icao24}
                          </Typography>
                          <Typography variant="h5" component="h2">
                            DepartureAirport: {val.estDepartureAirport}
                          </Typography>
                          <Typography variant="h5" component="h2">
                            ArrivalAirport: {val.estArrivalAirport}
                          </Typography>
                          <Typography variant="body2" component="p">
                            HorizontalDistance : {val.estDepartureAirportHorizDistance}
                          </Typography>
                          <Typography variant="body2" component="p">
                            VerticalDistance : {val.estDepartureAirportVertDistance}
                            <br />
                          </Typography>
                          <Typography variant="body2" component="p">
                            CallSign : {val.callsign}
                            <br />
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })
                }
              </Grid>
            </Container>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );

  const getCityInfo = (airport) => {
    setIcao(airport);
    setOpen(true);
  }

  const getArrivalsByAirport = (airport, begin, end) => {
    console.log('arrival = ',airport, begin, end);
    let options = {
      method: 'GET',
      headers: {}
    };

    fetch('https://opensky-network.org/api/flights/arrival?airport='+airport+'&begin='+begin+'&end='+end, options)
      .then(response => response.json())
      .then(data => {
        console.log('arrival airport data = ', data);
        setAllArrialsFlights(data);
      })
      .catch(error => {
        console.log(error)
      });
  }

  const getDeparturesByAirport = (airport, begin, end) => {
    console.log('airport = ',airport, begin, end);
    let options = {
      method: 'GET',
      headers: {}
    };

    fetch('https://opensky-network.org/api/flights/departure?airport='+airport+'&begin='+begin+'&end='+end, options)
      .then(response => response.json())
      .then(data => {
        console.log('departure airport data = ', data);
        setAllDepaturesFlights(data);
      })
      .catch(error => {
        console.log(error)
      });
  }

  const getFlightsByAircraft = (icao24) => {
    let curTimestamp = new Date().getTime() / 1000 | 0;
    let begin = curTimestamp - 48 *  60 * 60;
    let end = curTimestamp;
    let options = {
      method: 'GET',
      headers: {}
    };

    fetch('https://opensky-network.org/api/flights/aircraft?icao24='+icao24+'&begin='+begin+'&end='+end, options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAllFlights(data);
      })
      .catch(error => {
      });
  }

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  
  const airports = _.countBy(states.items);
  
  const aa = _.mapValues(_.invert(_.invert(airports)),parseInt);
  const items = Object.keys(aa).sort(function(a,b){return aa[b]-aa[a]});
  
  let regions = items.map(item => {
    const cityObj = icaoData.find(d => d.icao === item);
      return cityObj ? cityObj.region_name : "";
  })
  
  regions = regions.filter(d=>d);
  // console.log('aa = ', aa)
  // console.log('items = ', items)
  // console.log('regions = ', regions)
  return (
    <div>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
            </Typography>
          <Typography component="h1" variant="h6" noWrap>
            <Link href="login" className={classes.logout}>
              Logout
              </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container justify="center"> 
            {regions !== undefined && regions.map((value, index) => { return (index < 11) && (
                <Card className={classes.root} variant="outlined" key={index}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {value}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="contained" color="primary" onClick={() => { getCityInfo(items[index]); }}>Flight Info</Button>
                  </CardActions>
                </Card>
              )
            })}
          </Grid>
        </Container>
      </main>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        {body}
      </Modal>
    </div>
  );
}

export { HomePage };
