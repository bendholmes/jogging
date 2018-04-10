import { BASE_URL } from "./constants";

/**
 * Adapted from https://www.w3schools.com/js/js_cookies.asp
 * NOTE: Be sure to run at 127.0.0.1 *NOT* localhost as otherwise JS can't read the cookie
 *
 * Gets the value of a cookie from the given name.
 * @param cname The cookie name.
 * @returns {string} The cookie value.
 */
export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
    }
  }
  return "";
}

// TODO: Handle 401 unauthorized responses here by returning to login (unless we are trying to login)

/**
 * Wrapper around fetch to make a POST call including all required auth headers.
 * @param url The URL to get.
 * @param extra Extra params as needed.
 * @returns {Promise<Response>} Fetch promise.
 */
export function post(url, body={}, extra={}) {
  let params = {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  };
  params.body = JSON.stringify(body);
  Object.assign(params, extra);

  return fetch(
    BASE_URL + url + "/",
    params
  );
}

/**
 * Wrapper around fetch to make a GET call including required auth settings.
 * @param url The URL to get.
 * @returns {Promise<Response>} Fetch promise.
 */
export function get(url) {
  return fetch(
    BASE_URL + url + "/",
    {credentials: "include"}
  );
}

/**
 * Stores the logged in user in local storage. No need to use Flux / Redux for such a simple SPA. If we are not
 * given a user object then we remove it entirely.
 * @param user The user object.
 */
export function setUser(user) {
  user ? localStorage.setItem("user", JSON.stringify(user)) : localStorage.removeItem("user");
}

/**
 * Gets the logged in user from local storage.
 * @returns {string | null} The user object.
 */
export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function isAdmin() {
  return getUser().role === "admin";
}

export function isManager() {
  return getUser().role === "manager";
}