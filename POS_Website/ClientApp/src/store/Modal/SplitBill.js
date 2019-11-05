import * as dataService from "../../services/DataServices";

const requestNewBillDetailType = "REQUEST_NEW_BILL_DETAIL";
const receiveNewBillDetailType = "RECEIVE_NEW_BILL_DETAIL";

const requestSplitBillDetailType = "REQUEST_SPLIT_BILL_DETAIL";
const receiveSplitBillDetailType = "RECEIVE_SPLIT_BILL_DETAIL";

const initialState = {
  newBillDetail: [],
  billDetailTmp: [],
  splitBillDetail: []
};

export const actionCreators = {
  requestNewBillDetail: data => async dispatch => {
    try {
      dispatch({ type: requestNewBillDetailType });

      var url = "api/Slipt/GetTmpCheckNo?";
      const params = dataService.dataToParams(data);
      const res = await dataService.get(url + params);
      console.log(res);

      dispatch({ type: receiveNewBillDetailType, newBillDetail: res.data });
    } catch (e) {
      console.log(e.response);
    }
  },

  requestSplitBillDetail: data => async dispatch => {
    try {
      dispatch({ type: requestSplitBillDetailType });

      var url = "api/Slipt/GetTmpCheckNo?";
      const params = dataService.dataToParams(data);
      const res = await dataService.get(url + params);
      console.log(res);

      dispatch({ type: receiveSplitBillDetailType, splitBillDetail: res.data });
    } catch (e) {
      console.log(e.response);
    }
  },

  splitEqualPart: data => async () => {
    try {
      var url = `api/Slipt/SliptEqualPart?`;
      const params = dataService.dataToParams(data);
      const res = await dataService.get(url + params);
      return res;
    } catch (e) {
      console.log(e.response);
    }
  },

  splitAmount: data => async () => {
    try {
      var url = `api/Slipt/SliptAmount?`;
      const params = dataService.dataToParams(data);
      const res = await dataService.get(url + params);
      return res;
    } catch (e) {
      console.log(e.response);
    }
  },

  createNewCheck: checkNo => async () => {
    try {
      var url = `api/Slipt/SliptCreateNewCheck?CheckNo=${checkNo}`;
      const res = await dataService.get(url);
      return res;
    } catch (e) {
      console.log(e.response);
    }
  },

  splitTransfer: data => async () => {
    try {
      var url = `api/Slipt/SliptTranfer?`;
      const params = dataService.dataToParams(data);
      const res = await dataService.get(url + params);
      return res;
    } catch (e) {
      console.log(e.response);
    }
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestNewBillDetailType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveNewBillDetailType) {
    return {
      ...state,
      newBillDetail: action.newBillDetail,
      isLoading: false
    };
  }

  if (action.type === requestSplitBillDetailType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveSplitBillDetailType) {
    return {
      ...state,
      splitBillDetail: action.splitBillDetail,
      isLoading: false
    };
  }

  return state;
};
