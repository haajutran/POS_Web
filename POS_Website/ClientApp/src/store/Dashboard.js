// import * as dataService from "../services/DataService";

// const requestDashboardType = "REQUEST_DASHBOARD";
// const receiveDashboardType = "RECEIVE_DASHBOARD";

// const initialState = { isLoading: false };

// export const actionCreators = {
//   requestDashboard: () => async dispatch => {
//     dispatch({ type: requestDashboardType });
//     const url = "api/api/Dashboard/getlistdata";
//     const res = await dataService.get(url);
//     console.log(res);

//     dispatch({ type: receiveDashboardType, dashboard: res.data });
//   }
// };

// export const reducer = (state, action) => {
//   state = state || initialState;

//   if (action.type === requestDashboardType) {
//     return {
//       ...state,
//       isLoading: true
//     };
//   }

//   if (action.type === receiveDashboardType) {
//     return {
//       ...state,
//       dashboard: action.dashboard,
//       isLoading: false
//     };
//   }

//   return state;
// };
