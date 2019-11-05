import * as dataService from "../../services/DataServices";

const requestClientsType = "REQUEST_CLIENTS_DETAIL";
const receiveClientsType = "RECEIVE_CLIENTS_DETAIL";

const initialState = {
  clients: []
};

export const actionCreators = {
  filterClients: data => async dispatch => {
    try {
      dispatch({ type: requestClientsType });

      var url = "api/SelectClient/GetListClient?";
      const params = dataService.dataToParams(data);
      const res = await dataService.get(url + params);
      console.log(res);

      dispatch({ type: receiveClientsType, clients: res.data });
    } catch (e) {
      console.log(e.response);
    }
  },
  selectClient: data => async () => {
    try {
      var url = "api/SelectClient/ClientInfo?";
      const params = dataService.dataToParams(data);
      const res = await dataService.post(url + params, "");

      return res;
    } catch (e) {
      console.log(e.response);
    }
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestClientsType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveClientsType) {
    return {
      ...state,
      clients: action.clients,
      isLoading: false
    };
  }

  return state;
};
