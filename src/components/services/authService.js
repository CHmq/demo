import {
  client,
  setMID,
  // getMID,
  setUToken,
  getUToken,
  getUUID
} from "components/services/apiService";
import { API_URL } from "config/url";

const url = `${API_URL.user}/auth`;

// 登录
export async function login(name, pwd) {
  return await client
    .post({
      url: `${url}/login`,
      form: {
        username: name,
        password: pwd
      }
    })
    .then(ret => {
      setMID("");
      setUToken(ret);
      return ret;
    });
}

//注册
export async function register(getType, value) {
  const type = getType === "tel" ? "tel" : "email";
  return await client
    .post({
      url: `${API_URL.user}/user/register`,
      form: {
        [type]: getType === "tel" ? value.pre + value.tel : value.email,
        password: value.pwd,
        sex: value.sex,
        first_name: value.fsn,
        last_name: value.lsn,
        language: "cn",
        family_token: value.family_token,
        kid_token: value.kid_token || null
      }
    })
    .then(ret => {
      setMID("");
      setUToken(ret);
      return ret;
    });
}

//验证
export async function verify(captcha) {
  return await client.post({
    url: `${API_URL.user}/user/verify`,
    form: {
      vcode: captcha
    }
  });
}

//重发验证码
export async function resend() {
  await client.post({
    url: `${API_URL.user}/user/resend`,
    form: {}
  });
}

export async function logout() {
  return await client
    .post({
      url: `${url}/logout`,
      form: {}
    })
    .then(ret => {
      resetUser();
      return ret;
    })
    .catch(ret => {
      return ret.result;
    });
}

export function resetUser() {
  setUToken("");
  setMID("");
}

export function isAuth() {
  return !!(getUToken() && getUUID());
}

export default {
  login,
  register,
  verify,
  resend,
  logout,
  isAuth
};
