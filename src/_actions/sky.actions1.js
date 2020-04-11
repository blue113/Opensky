import { skyConstants } from '../_constants';
import { skyService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';
import axios from 'axios';
import _ from 'lodash';

export const skyActions = {
  getAllStates
};

 function getFlightsByAircraft(icao24) {
  let curTimestamp = new Date().getTime() / 1000 | 0;
  console.log("curTimestamp ====> ", curTimestamp);
  let begin = curTimestamp - 10*24 *  60 * 60;
  let end = curTimestamp;
  console.log('begin === > ', begin)
  console.log('end === > ', end)
  var options = {
    method: 'GET',
    headers: {}
  }; 
  // fetch('https://opensky-network.org/api/flights/aircraft?icao24=3c675a&begin=1517184000&end=1517270400', options)
  const res= fetch('https://opensky-network.org/api/flights/aircraft?icao24='+icao24+'&begin='+begin+'&end='+end, options);
  console.log('getFlightsByAircraft:', res)
    // .then(response => response.json())
    // .then(data => {
    //   const departures = data.map(d => d.estDepartureAirport).filter(d=>d);
    //   const arrivals = data.map(d => d.estArrivalAirport).filter(d=>d);;
    //   console.log('airports data:', data);
    //   // airports.push(data.estDepartureAirport);
    //   airports = airports.concat([...departures, ...arrivals]);
    //   // data.map(item => {
    //   //   if (item.estDepartureAirport !== null && item.estArrivalAirport !== null) {
    //   //     airports.push(item.estDepartureAirport, item.estArrivalAirport); 
    //   //   }
    //   // });
    //   console.log('airports', airports);
    //   return data;
    // })
    // .catch(error => {
    // });
}

 function getAllStates() {
  return dispatch => { 
    dispatch(request());
    var options = {
      method: 'GET',
      headers: {}
    };

    fetch('https://opensky-network.org/api/states/all', options)
      .then(response => response.json())
      .then( data => {
        console.log('states/all:' , data);
        var transformedData = []
        const states = [];
        var airportArray = [];
        if (data !== undefined && data.states !== undefined) {
          data.states.map((value) => {

            states.push({
              stateName: value[2],
              icao24: value[0]
            })

          }
          );
        }








        console.log('states = ', states)
        const requests = [];
        let curTimestamp = new Date().getTime() / 1000 | 0;
        // console.log("curTimestamp ====> ", curTimestamp);
        let begin = curTimestamp - 10*24 *  60 * 60;
        let end = curTimestamp;
        for (let i = 0; i < 10; i++) {
          requests.push(
            axios.get('https://opensky-network.org/api/flights/aircraft?icao24='+states[i].icao24+'&begin='+begin+'&end='+end)
              .catch(e=>{return e.error})
          )
        }

 
        var airports = [];

        Promise.all(requests).then(function(data) {
          for (const d of data.filter(a=>a)) {
            for (const ac of d.data) {
              airports.push(ac.estDepartureAirport)
              airports.push(ac.estArrivalAirport)
            }
          }
          airports = airports.filter(a=>a);
          console.log('airports:', airports);
          dispatch(success(airports));
          // const cnt = _.countBy(airports)
          // console.log('cnt:', cnt);

        });

        if (states !== undefined && states != []) {
          const fStates = states.reduce(
            (statesSoFar, { stateName, icao24, long, lat }) => {
              if (!statesSoFar[stateName]) statesSoFar[stateName] = [];
              statesSoFar[stateName].push({
                stateName: stateName,
                icao24: icao24
              });
              return statesSoFar;
            },
            {}
          );
          if (fStates !== undefined) {

            const entries = Object.entries(fStates)
            for (const [country, states] of entries) {
              transformedData.push({countryName: country, flights: states});
            }

            transformedData.sort(function(a, b){
              // ASC  -> a.length - b.length
              // DESC -> b.length - a.length
              return b.flights.length - a.flights.length;
            });

            console.log(transformedData)
            // dispatch(success(transformedData));
          }
        }

        history.push('/');
      })
      .catch(error => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      });
  };

  function request() { return { type: skyConstants.GET_ALL_STATES_REQUEST } }
  function success(states) { return { type: skyConstants.GET_ALL_STATES_SUCCESS, states } }
  function failure(error) { return { type: skyConstants.GET_ALL_STATES_FAILURE, error } }
}
