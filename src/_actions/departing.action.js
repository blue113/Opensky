
import { skyConstants } from '../_constants';
import { skyService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const skyActions = {
    getAllStates
};

function getDepartingFlights(airport, begin, end) {
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

    function request() { return { type: skyConstants.GET_DEPART_FLIGHTS_REQUEST } }
    function success(states) { return { type: skyConstants.GET_DEPART_FLIGHTS_SUCCESS, states } }
    function failure(error) { return { type: skyConstants.GET_DEPART_FLIGHTS_FAILURE, error } }
}
