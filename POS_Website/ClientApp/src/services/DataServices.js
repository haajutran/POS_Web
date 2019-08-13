import * as constant from "./Constant";
import axios from "axios";

function getHeader() {
  var header = {
    Accept: "application/json",
    "Content-Type": "application/json"
    // Authorization: "Bearer " + authService.getLoggedInUser().access_token
  };
  return header;
}

function getHeaderWithoutBearer() {
  var header = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };
  return header;
}

export const login = async data => {
  return await axios
    .post(
      constant.BASE_URL + "api/LoginPOS/GetUserName?RVCNo=33&Password=1007",
      data,
      {
        headers: getHeaderWithoutBearer()
      }
    )
    .then(res => {
      return res;
    })
    .catch(error => {
      return error.response;
    });
};

export const get = async url => {
  return await axios
    .get(constant.BASE_URL + url)
    .then(res => {
      return res;
    })
    .catch(error => {
      return error.response;
    });
};

export const post = async (url, data) => {
  // console.log(url, data);
  return await axios
    .post(constant.BASE_URL + url, JSON.stringify(data), {
      headers: getHeader()
    })
    .then(res => {
      return res;
    })
    .catch(error => {
      return error.message;
    });
};

export const upload = async (url, file) => {
  var data = new FormData();
  data.append("file", file);
  return axios.post(constant.BASE_URL + url, data).then(res => {
    return res.data;
  });
};

// export const postAndGetJson = async (url, data) => {
//   return await fetch(constant.BASE_URL + url, {
//     method: "POST",
//     headers: getHeader(),
//     body: JSON.stringify(data)
//   }).then(function(response) {
//     if (response.status == 401) {
//       window.location.assign(constant.BASE_URL + "notallow");
//     } else {
//       return response.data;
//     }
//   });
// };

export const put = async (url, data) => {
  return await axios
    .put(constant.BASE_URL + url, JSON.stringify(data), {
      headers: getHeader()
    })
    .then(res => {
      return res;
    })
    .catch(error => {
      return error.response;
    });
};

export const remove = async url => {
  return await axios
    .delete(constant.BASE_URL + url, { headers: getHeader() })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return error.response;
    });
};
