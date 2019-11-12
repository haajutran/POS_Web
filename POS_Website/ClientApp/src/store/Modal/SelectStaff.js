import * as dataService from "../../services/DataServices";

const requestStaffsType = "REQUEST_STAFFS";
const receiveStaffsType = "RECEIVE_STAFFS";

const initialState = {
  staffs: []
};

export const actionCreators = {
  filterStaffs: data => async dispatch => {
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
  clearStaffs: () => async dispatch => {
    try {
      dispatch({ type: receiveClientsType, clients: [] });
    } catch (e) {
      console.log(e.response);
    }
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestStaffsType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveStaffsType) {
    return {
      ...state,
      staffs: action.staffs,
      isLoading: false
    };
  }

  return state;
};
