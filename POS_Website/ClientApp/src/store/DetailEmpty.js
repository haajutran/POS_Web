import * as dataServices from "../services/DataServices";
import { ExceptionMap } from "antd/lib/result";

const requestClientListType = "REQUEST_CLIENT_LIST";
const receiveClientListType = "RECEIVE_CLIENT_LIST";

const requestTablesJoinType = "REQUEST_TABLES_JOIN";
const receiveTablesJoinType = "RECEIVE_TABLES_JOIN";

const initialState = {
  isLoading: false,
  clientList: [],
  tablesJoin: []
};

export const actionCreators = {
  getMealPeriod: () => async () => {
    try {
      const rvcNo = sessionStorage.getItem("rvcNo");
      const res = await dataServices.get(
        `api/TableInfo/GetMealPeriod?RVCNo=${rvcNo}`
      );
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  },
  getUserDefineDef: () => async () => {
    try {
      const res = await dataServices.get(`api/TableInfo/GetUserDefineDef`);
      console.log(res);
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      console.log(e.message);
    }
  },
  getStatistic: length => async () => {
    try {
      var statistic = [];
      for (var i = 1; i <= length; i++) {
        const s = await dataServices.get(`api/TableInfo/GetStatistic${i}`);
        statistic.push(s.data);
      }
      return statistic;
    } catch (e) {
      console.log(e.message);
    }
  },
  getTmpID: () => async () => {
    try {
      const tmpID = await dataServices.get(`api/TableInfo/GetTmpIDTableJoin`);

      if (tmpID.status === 200) {
        return tmpID.data[0].tmpIDTableJoin;
      }
    } catch (e) {
      console.log(e.message);
    }
  },
  addTablesJoin: (tmpIDTableJoin, tableMain, joined) => async () => {
    try {
      const posDate = new Date(sessionStorage.getItem("posDate"));
      const posDay = posDate.getDay();
      const posMonth = posDate.getMonth();
      const posYear = posDate.getFullYear();
      for (var i = 0; i < joined.length; i++) {
        // const table = {
        //   RVCNo: parseInt(sessionStorage.getItem("rvcNo")),
        //   UserLogin: sessionStorage.getItem("posUser"),
        //   TableMain: tableMain,
        //   TableJoin: joined[i],
        //   TmpIDTableJoin: parseFloat(tmpIDTableJoin),
        //   POSDay: posDay,
        //   POSMonth: posMonth,
        //   POSYear: posYear
        // };
        const rvcNo = sessionStorage.getItem("rvcNo");
        const params = `?RVCNo=${rvcNo}&UserLogin=${sessionStorage.getItem(
          "posUser"
        )}&TableMain=${tableMain}&TableJoin=${
          joined[i]
        }&TmpIDTableJoin=${parseFloat(
          tmpIDTableJoin
        )}&POSDay=${posDay}&POSMonth=${posMonth}&POSYear=${posYear}`;
        // console.log(table);
        const res = await dataServices.post(
          "api/TableInfo/AddTableJoin" + params,
          ""
        );
        // console.log(res);
        if (res.status !== 200) {
          throw { message: "Error" };
        }
        console.log(res);
      }
      return 200;
    } catch (e) {
      console.log(e.message);
    }
  },
  requestTablesJoin: (tableMain, tmpIDTableJoin) => async dispatch => {
    try {
      dispatch({ type: requestTablesJoinType });
      const rvcNo = sessionStorage.getItem("rvcNo");
      const res = await dataServices.get(
        `api/TableInfo/GetTableJoin?RVCNo=${rvcNo}&TableMain=${tableMain}&tmpIDTableJoin=${tmpIDTableJoin}`
      );
      // console.log(rvcNo, tableMain, tmpIDTableJoin);
      console.log(res);
      if (res.status === 200) {
        dispatch({ type: receiveTablesJoinType, tablesJoin: res.data });
      }
    } catch (e) {
      dispatch({ type: receiveTablesJoinType, tablesJoin: [] });
      console.log(e.message);
    }
  },
  deleteTableJoin: tableCode => async () => {
    try {
      const rvcNo = sessionStorage.getItem("rvcNo");
      const res = await dataServices.get(
        `api/TableInfo/DeleteTableJoin?rvcNo=${rvcNo}&tableCode=${tableCode}`
      );

      return res.status;
    } catch (e) {
      console.log(e.message);
    }
  },
  requestClientList: ClientInfo => async dispatch => {
    try {
      dispatch({ type: requestClientListType });
      const res = await dataServices.get(
        `api/TableInfo/GetListClient?ClientInfo=${ClientInfo}`
      );
      if (res.status === 200) {
        dispatch({ type: receiveClientListType, clientList: res.data });
      }
    } catch (e) {
      console.log(e.message);
      dispatch({ type: receiveClientListType, clientList: [] });
    }
  },
  okNewTable: data => async () => {
    // console.log(trnSeq, qTy);
    try {
      console.log(data);
      var params = "";
      Object.entries(data).map(([key, value]) => {
        // console.log(key, value);
        if (value) {
          console.log(key);
          if (key.includes("Sts")) {
            params += key + "=" + value.stsCode + "&";
          } else {
            params += key + "=" + value + "&";
          }
        }
      });

      var url = "api/TableInfo/OKNewTable?" + params;
      console.log(url);
      const res = await dataServices.post(url, "");

      console.log(res);
      return res;
      // return 200;
    } catch (e) {
      console.log(e.response);
    }
  },
  cancelNewTable: tmpJoinTable => async () => {
    // console.log(trnSeq, qTy);
    try {
      const res = await dataServices.post(
        `api/TableInfo/CancelNewTable?tmpJoinTable=${tmpJoinTable}`,
        ""
      );
      return res;
    } catch (e) {
      console.log(e.message);
    }
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestClientListType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveClientListType) {
    return {
      ...state,
      clientList: action.clientList,
      isLoading: false
    };
  }
  if (action.type === requestTablesJoinType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveTablesJoinType) {
    return {
      ...state,
      tablesJoin: action.tablesJoin,
      isLoading: false
    };
  }

  return state;
};
