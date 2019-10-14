import * as dataService from "../../services/DataServices";

const requestListDiscountType = "REQUEST_LIST_DISCOUNT";
const receiveListDiscountType = "RECEIVE_LIST_DISCOUNT";

const requestListClassByBillType = "REQUEST_LIST_CLASS_BILL";
const receiveListClassByBillType = "RECEIVE_LIST_CLASS_BILL";

const initialState = {
  isLoading: false,
  listDiscount: [],
  listClassByBill: []
};

export const actionCreators = {
  requestListDiscount: checkNo => async dispatch => {
    try {
      dispatch({ type: requestListDiscountType });
      const url = `api/Discount/ListDiscount?CheckNo=${checkNo}`;
      const res = await dataService.get(url);
      dispatch({ type: receiveListDiscountType, listDiscount: res.data });
    } catch (e) {
      console.log(e.message);
    }
  },
  selectDiscount: dscCode => async () => {
    try {
      const url = `api/Discount/SelectDiscount?DscCode=${dscCode}`;
      const res = await dataService.get(url);
      return res;
    } catch (e) {
      console.log(e.message);
    }
  },
  requestListClassByBill: data => async dispatch => {
    try {
      dispatch({ type: requestListClassByBillType });
      const url = `api/Discount/ListClassByBill?CheckNo=${data.CheckNo}&DscCode=${data.DscCode}&OnTotal=${data.OnTotal}`;
      const res = await dataService.get(url);
      console.log(res);
      dispatch({ type: receiveListClassByBillType, listClassByBill: res.data });
    } catch (e) {
      console.log(e.message);
      dispatch({
        type: receiveListClassByBillType,
        listClassByBill: []
      });
    }
  },
  discount: data => async () => {
    try {
      var url = `api/Discount/Discount?`;
      for (let [key, value] of Object.entries(data)) {
        // console.log(`${key}: ${value.length}`);
        if (value.toString().length > 0) {
          url = url + key + "=" + value + "&";
        }
      }
      const res = await dataService.post(url, "");
      return res;
    } catch (e) {
      console.log(e.message);
    }
  },
  itemDiscount: data => async () => {
    try {
      var url = `api/ItemDiscount/ItemDiscount?`;
      for (let [key, value] of Object.entries(data)) {
        // console.log(`${key}: ${value.length}`);
        if (value.toString().length > 0) {
          url = url + key + "=" + value + "&";
        }
      }
      const res = await dataService.post(url, "");
      return res;
    } catch (e) {
      console.log(e.message);
    }
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestListDiscountType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveListDiscountType) {
    return {
      ...state,
      listDiscount: action.listDiscount,
      isLoading: false
    };
  }

  if (action.type === requestListClassByBillType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveListClassByBillType) {
    return {
      ...state,
      listClassByBill: action.listClassByBill,
      isLoading: false
    };
  }

  return state;
};
