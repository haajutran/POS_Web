import * as dataServices from "../services/DataServices";
const requestDefRVCListType = "REQUEST_DEFRPVLIST";
const receiveDefRVCListType = "RECEIVE_DEFRPVLIST";

const requestNotisType = "REQUEST_NOTIS";
const receiveNotisType = "RECEIVE_NOTIS";

const initialState = { isLoading: false, defRVCList: "", notis: [] };

export const actionCreators = {
  requestDefRVCList: () => async dispatch => {
    try {
      dispatch({ type: requestDefRVCListType });
      const res = await dataServices.get("api/Login/GetDefRVCLists");
      // console.log(res);
      if (res.status === 200) {
        dispatch({ type: receiveDefRVCListType, defRVCList: res.data });
      }
    } catch (e) {
      console.log(e);
    }
  },
  getTotalNotis: () => async () => {
    try {
      const res = await dataServices.get("api/Login/GetTotalAlertByDate");

      if (res.status === 200) {
        return res.data[0];
      }
    } catch (e) {
      console.log(e);
    }
  },
  getNoti: id => async () => {
    try {
      const res = await dataServices.get(
        "api/Login/GetAlertOneByDate?IDAlert=" + id
      );
      if (res.status === 200) {
        return res.data[0];
      }
    } catch (e) {
      console.log(e);
    }
  },
  requestNotis: () => async dispatch => {
    try {
      dispatch({ type: receiveNotisType });
      const res = await dataServices.get("api/Login/GetAlertMoreOneByDate");
      console.log(res);
      if (res.status === 200) {
        dispatch({ type: receiveNotisType, notis: res.data });
      }
    } catch (e) {
      console.log(e);
    }
  },
  login: data => async () => {
    // console.log(data);
    const res = await dataServices.get(
      `api/Login/GetUserName?RVCNo=${data.rvcNo}&Password=${data.password}`
    );
    if (res.status === 200) {
      return res.data[0];
    }
  },
  setPOSInfo: (user, rvcNo) => async () => {
    const res = await dataServices.get(
      `api/GetTableMap/GetPOSInfo?RVCCode=${rvcNo}&POSUser=${user}`
    );
    console.log(res);
    if (res.status === 200) {
      sessionStorage.setItem("posDate", res.data[0].posDate);
    }
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestDefRVCListType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveDefRVCListType) {
    return {
      ...state,
      defRVCList: action.defRVCList,
      isLoading: false
    };
  }

  if (action.type === requestNotisType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveNotisType) {
    return {
      ...state,
      notis: action.notis,
      isLoading: false
    };
  }

  return state;
};
