import * as dataServices from "../services/DataServices";

const requestTableTypesType = "REQUEST_TABLE_TYPES";
const receiveTableTypesType = "RECEIVE_TABLE_TYPES";

const requestTableAreasType = "REQUEST_TABLE_AREAS";
const receiveTableAreasType = "RECEIVE_TABLE_AREAS";

const requestRVCQuickInfomationType = "REQUEST_RVCQIT";
const receiveRVCQuickInfomationType = "RECEIVE_RVCQIT";

const initialState = {
  isLoading: false,
  tableTypes: [],
  tableAreas: [],
  RVCQuickInfomation: {}
};

export const actionCreators = {
  requestTableTypes: () => async dispatch => {
    try {
      dispatch({ type: requestTableTypesType });
      const ttsRes = await dataServices.get("api/GetTableMap/GetTableType");
      if (ttsRes.status === 200) {
        dispatch({ type: receiveTableTypesType, tableTypes: ttsRes.data });
      }
    } catch (e) {
      dispatch({ type: receiveTableTypesType, tableTypes: [] });
    }
  },

  requestTableAreas: () => async dispatch => {
    try {
      dispatch({ type: requestTableAreasType });
      const tasRes = await dataServices.get(
        "api/GetTableMap/GetTableAreas?RVCNo=33"
      );
      if (tasRes.status === 200) {
        for (var ta of tasRes.data) {
          var tmTemp = [];
          const tmsRes = await dataServices.get(
            `api/GetTableMap/GetTableMap?RVCNo=33&TableArea=${ta.tableArea1}`
          );
          if (tmsRes.status === 200) {
            tmTemp = tmsRes.data;
          }
          ta["tableMaps"] = tmTemp;
          // console.log(tms);
        }
        console.log(tasRes.data);

        dispatch({ type: receiveTableAreasType, tableAreas: tasRes.data });
      }
    } catch (e) {
      console.log(e.response);
      dispatch({ type: receiveTableAreasType, tableAreas: [] });
    }
  },

  requestRVCQuickInfomation: () => async dispatch => {
    try {
      dispatch({ type: requestRVCQuickInfomationType });
      const res = await dataServices.get(
        "api/GetTableMap/GetRVCQuickInfomation?RVCNo=33&POSDay=04&POSMonth=06&POSYear=2019"
      );
      if (res.status === 200) {
        dispatch({
          type: receiveRVCQuickInfomationType,
          RVCQuickInfomation: res.data
        });
      }
    } catch (e) {
      console.log(e.response);
      dispatch({ type: receiveRVCQuickInfomationType, RVCQuickInfomation: {} });
    }
  },

  requestPOSInfo: () => async () => {
    try {
      const rvcNo = sessionStorage.getItem("rvcNo");
      const posUser = sessionStorage.getItem("posUser");
      const res = await dataServices.get(
        `api/GetTableMap/GetPOSInfo?RVCCode=${rvcNo}&POSUser=${posUser}`
      );
      if (res.status === 200) {
        sessionStorage.setItem("posDate", res.data[0].posDate);
      }
    } catch (e) {
      console.log(e.response);
    }
  },

  checkTableHold: checkNo => async () => {
    try {
      const res = await dataServices.get(
        `api/GetTableMap/CheckTableHold?CheckNo=${checkNo}`
      );
      if (res.status === 200) {
        return res.data[0];
      }
    } catch (e) {
      console.log(e.response);
    }
  },

  getBillDetail: data => async () => {
    try {
      var url = "api/Slipt/GetTmpCheckNo?";
      const params = dataServices.dataToParams(data);
      const res = await dataServices.get(url + params);
      console.log(res);
      return res;
    } catch (e) {
      console.log(e.response);
    }
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestTableAreasType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveTableAreasType) {
    return {
      ...state,
      tableAreas: action.tableAreas,
      isLoading: false
    };
  }

  if (action.type === requestTableTypesType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveTableTypesType) {
    return {
      ...state,
      tableTypes: action.tableTypes,
      isLoading: false
    };
  }

  if (action.type === requestRVCQuickInfomationType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveRVCQuickInfomationType) {
    return {
      ...state,
      RVCQuickInfomation: action.RVCQuickInfomation,
      isLoading: false
    };
  }

  return state;
};
