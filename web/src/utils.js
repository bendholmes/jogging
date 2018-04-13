import {BASE_URL, URLs} from "./constants";
import moment from "moment";

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
 * @param body The body payload as needed.
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
 * @param params Optional object of param key and values.
 * @returns {Promise<Response>} Fetch promise.
 */
export function get(url, params=null) {
  url = BASE_URL + url + "/";

  if (params) {
    const urlParams = new URLSearchParams(Object.entries(params));
    url += "?" + urlParams;
  }

  return fetch(url, {credentials: "include"});
}

/**
 * Updates an object with the given id with the given data at the given url.
 * @param url The URL to update.
 * @param id The id of the object to update.
 * @param data The data to update the object with.
 * @returns {Promise<Response>} Fetch promise.
 */
export function patch(url, id, data) {
  return fetch(
    BASE_URL + url + "/" + encodeURIComponent(id) + "/", // Make sure we encode the ID as it could contain any character
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );
}

/**
 * Deletes an object with the given id at the given url.
 * @param url The endpoint to delete from.
 * @param id The id of the object to delete.
 * @returns {Promise<Response>} Fetch promise.
 */
export function del(url, id) {
  return fetch(
    BASE_URL + url + "/" + encodeURIComponent(id) + "/", // Make sure we encode the ID as it could contain any character
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      }
    }
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

export function isUser() {
  return getUser().role === "user";
}

export function isAdmin() {
  return getUser().role === "admin";
}

export function isManager() {
  return getUser().role === "manager";
}

/**
 * Convenience method wrapping the date formatting used in the app.
 *
 * TODO: For simplicity, we are currently ignoring timezones.
 */
export function formatDate(date) {
  return moment.utc(date).format("ddd DD MMM Y @ h:mm A");
}

/**
 * Creates a new array from the given array without the object to remove.
 * @param arr The array to modify.
 * @param objIdToRemove Id of the object to remove.
 */
export function without(arr, objIdToRemove) {
  return arr.filter((obj) => obj.id !== objIdToRemove);
}

/**
 * Replaces an object in an array with the given id by the given object.
 * @param arr Array containing the object to replace.
 * @param objIdToReplace Id of the object to replace.
 * @param newObj The object to replace the existing one with.
 */
export function replace(arr, objIdToReplace, newObj) {
  return arr.map(obj => obj.id === objIdToReplace ? newObj : obj);
}

/**
 * Convenience method for logging out.
 * @param history The history so we can redirect.
 */
export function logout(history) {
  setUser();
  history.push(URLs.LOGIN);
}

/**
 * Calls the server to see if the user is authenticated. If they are not, logout is called clearing the
 * locally stored user and redirecting to login.
 * @param component The component attempting to authenticate.
 * @param successCallback Callback method on success.
 * @param errorCallback Callback method on error.
 */
export function authenticate(component, successCallback, errorCallback) {
  get("user/me")
  .then(
    (response) => {
      if (response.status !== 200) return logout(component.props.history);
      if (successCallback) successCallback(response);
    }
  )
  .catch(
    (error) => {
      if (errorCallback) errorCallback(error);
    }
  );
}
