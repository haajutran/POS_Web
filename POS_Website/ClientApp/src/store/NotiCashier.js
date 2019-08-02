import * as dataServices from "../services/DataServices";

const requestNotiCashierType = "REQUEST_NOTI_CASHIERS";
const receiveNotiCashierType = "RECEIVE_NOTI_CASHIERS";

const initialState = {
  isLoading: false,
  notiCashier: []
};

export const actionCreators = {
  requestNotiCashier: () => async dispatch => {
    try {
      dispatch({ type: requestNotiCashierType });
      const ncRes = await dataServices.get(
        "api/GetTableMap/GetAlertMoreOneByCashier"
      );
      console.log(ncRes);
      if (ncRes.status === 200) {
        dispatch({ type: receiveNotiCashierType, notiCashier: ncRes.data });
      }
    } catch (e) {
      dispatch({ type: receiveNotiCashierType, notiCashier: [] });
    }
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestNotiCashierType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveNotiCashierType) {
    return {
      ...state,
      notiCashier: action.notiCashier,
      isLoading: false
    };
  }

  return state;
};
