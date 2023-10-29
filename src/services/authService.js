import http from "./httpService";
import config from "../config.json";
import jwtDecode from "jwt-decode";
import { func } from "prop-types";

const apiEndpoint = config.apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
}
export function logout() {
  localStorage.removeItem(tokenKey);
}
export async function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
    // console.log(user);
    // this.setState({ user });
  } catch (ex) {
    return null;
  }
}
export function getJwt() {
  // console.log(localStorage.getItem(tokenKey), "jjjjjj");
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};
