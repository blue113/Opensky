import { skyConstants } from '../_constants';
import { skyService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const skyActions = {
    getAllStates
};

function getAllStates() {
    return dispatch => {
        dispatch(request());
        var options = {
          method: 'GET',
          headers: {}
        };
        fetch('https://opensky-network.org/api/states/all', options)
          .then(response => response.json())
          .then(data => {
            dispatch(success(data));
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

function getArrivingFlights(airport, begin, end) {
    return dispatch => {
        dispatch(request());
        var options = {
          method: 'GET',
          headers: {}
        };
        fetch('https://opensky-network.org/api/flights/departure?airport=EDDF&begin=1517227200&end=1517230800', options)
          .then(response => response.json())
          .then(data => {
            dispatch(success(data));
            history.push('/');
          })
          .catch(error => {
            dispatch(failure(error.toString()));
            dispatch(alertActions.error(error.toString()));
          });
    };

    function request() { return { type: skyConstants.GET_ARRIV_FLIGHTS_REQUEST } }
    function success(states) { return { type: skyConstants.GET_ARRIV_FLIGHTS_SUCCESS, states } }
    function failure(error) { return { type: skyConstants.GET_ARRIV_FLIGHTS_FAILURE, error } }
}
