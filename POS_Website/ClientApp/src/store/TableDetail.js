import * as dataServices from "../services/DataServices";

const requestMenusType = "REQUEST_MENUS";
const receiveMenusType = "RECEIVE_MENUS";

const requestBillDetailType = "REQUEST_BILL_DETAIL";
const receiveBillDetailType = "RECEIVE_BILL_DETAIL";

const requestCourseType = "REQUEST_COURSE";
const receiveCourseType = "RECEIVE_COURSE";

const requestVoidReasonType = "REQUEST_VOID_REASON";
const receiveVoidReasonType = "RECEIVE_VOID_REASON";

const requestRequestType = "REQUEST_REQUEST";
const receiveRequestType = "RECEIVE_REQUEST";

const requestTaxServiceType = "REQUEST_TAX_SERVICE";
const receiveTaxServiceType = "RECEIVE_TAX_SERVICE";

const initialState = {
  isLoading: false,
  menus: [],
  mainMenus: [],
  course: [],
  billDetail: [],
  requests: [],
  voidReason: [],
  taxServices: []
};

export const actionCreators = {
  requestMenus: menuNo => async (dispatch, getState) => {
    try {
      dispatch({ type: requestMenusType });
      const menusState = getState().tableDetail.menus;
      const rvcNo = sessionStorage.getItem("rvcNo");
      var res;
      var menus = [];
      var mainMenus = [];
      if (menuNo === 0) {
        res = await dataServices.get(`api/Menu/GetMenu?RVCNo=${rvcNo}`);
        menus = res.data;
        console.log(res);
      } else {
        res = await dataServices.get(
          `api/Menu/GetMenu?RVCNo=${rvcNo}&sMenuID=${menuNo}`
        );
        const menusTemp = res.data;
        console.log(menusTemp);
        if (menusTemp[0].dataReturn === "ITEM") {
          const res2 = await dataServices.get(
            `api/Menu/GetItemByMenu?RVCNo=${rvcNo}&sMenuID=${menuNo}&MyPeriod=1`
          );
          if (res2.status === 200) {
            menus = menusState;
            mainMenus = res2.data;
          }
        } else {
          menus = menusTemp;
        }
      }

      if (res.status === 200) {
        dispatch({ type: receiveMenusType, menus, mainMenus });
      }
    } catch (e) {
      console.log(e.message);
      dispatch({ type: receiveMenusType, menus: [], mainMenus: [] });
    }
  },
  requestBillDetail: (
    checkNo,
    viewSum,
    selectedGuest,
    selectedCourse
  ) => async dispatch => {
    try {
      dispatch({ type: requestBillDetailType });
      const res = await dataServices.get(
        `api/BillInfo/GetBillDetail?ViewSum=${viewSum}&SelectedGuest=${selectedGuest}&CheckNo=${checkNo}&SelectedCourse=${selectedCourse}`
      );
      console.log(res);
      if (res.status === 200) {
        dispatch({ type: receiveBillDetailType, billDetail: res.data });
      }
    } catch (e) {
      console.log(e.message);
      dispatch({ type: receiveBillDetailType, billDetail: [] });
    }
  },
  requestCourse: () => async dispatch => {
    try {
      dispatch({ type: requestCourseType });
      const res = await dataServices.get(`api/BillInfo/GetCourse`);
      if (res.status === 200) {
        dispatch({ type: receiveCourseType, course: res.data });
      }
    } catch (e) {
      console.log(e.message);
      dispatch({ type: receiveCourseType, course: [] });
    }
  },

  requestVoidReason: () => async dispatch => {
    try {
      dispatch({ type: requestVoidReasonType });
      const res = await dataServices.post(`api/VoidItem/VoidReason`, "");
      console.log(res);
      if (res.status === 200) {
        dispatch({ type: receiveVoidReasonType, voidReason: res.data });
      }
    } catch (e) {
      console.log(e.message);
      dispatch({ type: receiveVoidReasonType, voidReason: [] });
    }
  },

  sendOrder: checkNo => async dispatch => {
    try {
      const res = await dataServices.get(
        `api/SendOrder/SendOrder?CheckNo=${checkNo}`
      );
      console.log(res);
      return res.status;
    } catch (e) {
      console.log(e.message);
    }
  },

  getTableDetail: checkNo => async () => {
    try {
      // console.log(getState());
      const rvcNo = sessionStorage.getItem("rvcNo");
      const posUser = sessionStorage.getItem("posUser");
      const getDetailRes = await dataServices.get(
        `api/BillInfo/GetInfoCheckNo?CheckNo=${checkNo}&RVCNo=${rvcNo}&UserLogin=${posUser}&WSID=hau`
      );
      if (getDetailRes.status === 200) {
        return getDetailRes.data[0];
      }
    } catch (e) {
      console.log(e.message);
    }
  },
  postItemManual: data => async () => {
    try {
      const url = `api/PostItem/PostItemMunual?CheckNo=${data.CheckNo}&ICode=${
        data.ICode
      }&isAddOn=${data.isAddOn}&ChangeOrderNo=${
        data.ChangeOrderNo
      }&Qty=${parseInt(data.Qty)}&SelectedGuest=${
        data.SelectedGuest
      }&SelectedCourse=${data.SelectedCourse}`;

      const res = await dataServices.get(`${url}`);
      console.log(res);
      return res.status;
      // if (res.status === 200) {
      //   return res.data[0];
      // }
    } catch (e) {
      console.log(e.message);
    }
  },
  updateQuantity: (trnSeq, qTy) => async () => {
    // console.log(trnSeq, qTy);
    try {
      const url = `api/ChangeQty/ChangeQuantity?NewQty=${qTy}&TrnSeq=${trnSeq}`;
      const res = await dataServices.get(`${url}`);

      return res.status;
    } catch (e) {
      console.log(e.message);
    }
  },
  requestRequests: () => async dispatch => {
    try {
      dispatch({ type: requestRequestType });
      const res = await dataServices.post(`api/AddRequest/GetRequest`, "");
      console.log(res);
      if (res.status === 200) {
        dispatch({ type: receiveRequestType, requests: res.data });
      }
    } catch (e) {
      dispatch({ type: receiveRequestType, requests: [] });
      console.log(e.message);
    }
  },

  getItemRequest: (itemCode, trnCode) => async () => {
    // console.log(trnSeq, qTy);
    try {
      const res = await dataServices.post(
        `api/AddRequest/GetItemRequest?ItemCode=${itemCode}&TrnCode=${trnCode}`,
        ""
      );
      return res;
    } catch (e) {
      console.log(e.message);
    }
  },
  getClassRequest: (itemCode, trnCode) => async () => {
    // console.log(trnSeq, qTy);
    try {
      const res = await dataServices.post(
        `api/AddRequest/GetClassRequest?ItemCode=${itemCode}&TrnCode=${trnCode}`,
        ""
      );
      return res;
    } catch (e) {
      console.log(e.message);
    }
  },
  addRequest: data => async () => {
    try {
      const url = `api/AddRequest/AddRequest?ICode=${data.ICode}&CGCode=${data.CGCode}&CGName=${data.CGName}&Orther=${data.Orther}&IClass=${data.IClass}&Item=${data.Item}`;
      const res = await dataServices.post(
        `api/AddRequest/AddRequest?ICode=${data.ICode}&CGCode=${data.CGCode}&CGName=${data.CGName}&Orther=${data.Orther}&IClass=${data.IClass}&Item=${data.Item}`,
        ""
      );
      console.log(url);
      return res.status;
    } catch (e) {
      console.log(e.message);
    }
  },
  getOrderHold: checkNo => async () => {
    try {
      const res = await dataServices.get(
        `api/HoldItem/GetOrderHold?CheckNo=${checkNo}`
      );
      console.log(checkNo);
      return res;
    } catch (e) {
      console.log(e.message);
    }
  },

  getIDHoldMain: () => async () => {
    try {
      const rvcNo = sessionStorage.getItem("rvcNo");
      const res = await dataServices.get(
        `api/HoldItem/GetIDHoldMain?RVCNo=${rvcNo}`
      );
      return res;
    } catch (e) {
      console.log(e.message);
    }
  },

  holdItem: item => async () => {
    try {
      // const rvcNo = sessionStorage.getItem("rvcNo");
      // const res = await dataServices.get(
      //   `api/HoldItem/GetIDHoldMain?RVCNo=${rvcNo}`
      // );
      // return res;
      console.log(item);
    } catch (e) {
      console.log(e.message);
    }
  },

  voidItem: data => async () => {
    // console.log(data);
    var url = `api/VoidItem/VoidItem?`;
    for (let [key, value] of Object.entries(data)) {
      // console.log(`${key}: ${value.length}`);
      if (value.toString().length > 0) {
        url = url + key + "=" + value + "&";
      }
    }
    const res = await dataServices.post(url, "");
    return res;
  },

  cancelBill: checkNo => async () => {
    try {
      const res = await dataServices.post(
        `api/CancelAll/CancelAllBill?CheckNo=${checkNo}`,
        ""
      );
      if (res.status === 200) {
        window.location.replace("/");
      }
    } catch (e) {
      console.log(e.message);
    }
  },
  hideBill: data => async () => {
    try {
      const res = await dataServices.post(
        `api/HideBill/HideBill?CheckNo=${data.checkNo}&ReOpen=${data.reOpen}&MyOpenID=${data.myOpenID}`,
        ""
      );
      // console.log(res);
      if (res.status === 200) {
        window.location.replace("/");
      }
    } catch (e) {
      console.log(e.message);
    }
  },
  getAddOn: data => async () => {
    try {
      const res = await dataServices.post(
        `api/AddOn/GetAddOn?OrderNo=${data.OrderNo}&TrnSeq=${data.TrnSeq}&ItemCode=${data.ItemCode}`,
        ""
      );
      return res;
    } catch (e) {
      console.log(e.message);
    }
  },
  payCash: data => async () => {
    try {
      const res = await dataServices.get(
        `api/PayCash/PayCash?CheckNo=${data.checkNo}&GuestPay=${data.guestPay}`
      );
      return res;
    } catch (e) {
      console.log(e.message);
    }
  },
  requestTaxService: () => async dispatch => {
    try {
      dispatch({ type: requestTaxServiceType });
      const res = await dataServices.get(
        `api/AddRemoveTaxService/GetTitleAddRemoveTaxSVR`
      );
      if (res.status === 200) {
        console.log(res.data);

        dispatch({ type: receiveTaxServiceType, taxServices: res.data });
      }
    } catch (e) {
      console.log(e.message);
      dispatch({ type: receiveTaxServiceType, taxServices: [] });
    }
  },
  addTaxService: data => async () => {
    try {
      const res = await dataServices.get(
        `api/AddRemoveTaxService/GetAddRemoveTaxService?CheckNo=${data.checkNo}&Func=${data.func}`
      );
      return res;
    } catch (e) {
      console.log(e.message);
    }
  },
  mergeTable: (checkNo, mergeTable) => async () => {
    try {
      const res = await dataServices.get(
        `api/MergeTable/MergeTable?CurrentCheckNo=${checkNo}&NewCheckno=${mergeTable}`
      );
      return res;
    } catch (e) {
      console.log(e.message);
    }
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === requestMenusType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveMenusType) {
    return {
      ...state,
      menus: action.menus,
      mainMenus: action.mainMenus,
      isLoading: false
    };
  }

  if (action.type === requestCourseType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveCourseType) {
    return {
      ...state,
      course: action.course,
      isLoading: false
    };
  }
  if (action.type === requestBillDetailType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveBillDetailType) {
    return {
      ...state,
      billDetail: action.billDetail,
      isLoading: false
    };
  }

  if (action.type === requestRequestType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveRequestType) {
    return {
      ...state,
      requests: action.requests,
      isLoading: false
    };
  }

  if (action.type === requestVoidReasonType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveVoidReasonType) {
    return {
      ...state,
      voidReason: action.voidReason,
      isLoading: false
    };
  }

  if (action.type === requestTaxServiceType) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === receiveTaxServiceType) {
    return {
      ...state,
      taxServices: action.taxServices,
      isLoading: false
    };
  }

  return state;
};
