import * as dataService from "../../services/DataServices";

const initialState = {};

export const actionCreators = {
  splitEqualPart: data => async () => {
    try {
      var url = `api/Slipt/SliptEqualPart?`;
      const params = dataService.dataToParams(data);
      const res = await dataService.get(url + params);
      return res;
    } catch (e) {
      console.log(e.message);
    }
  },
  splitAmount: data => async () => {
    try {
      var url = `api/Slipt/SliptAmount?`;
      const params = dataService.dataToParams(data);
      const res = await dataService.get(url + params);
      return res;
    } catch (e) {
      console.log(e.message);
    }
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  return state;
};
