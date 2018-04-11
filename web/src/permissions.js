import { getUser } from "./utils";
import { URLs } from "./constants";


const PAGE_PERMISSIONS = {
  [URLs.USERS]: ['admin', 'manager']
};

/**
 * Checks if the logged in user has permission for the given key in the given permissions. If the
 * key is not defined in the permissions then we treat this as public.
 * @param permissions The permissions to check.
 * @param key The specific permission to check for.
 * @returns {boolean}
 */
export function hasPermission(permissions, key) {
  return key in permissions ?  permissions[key].includes(getUser().role) : true;
}

/**
 * Checks if the logged in user has permission to visit the given page.
 * @param url URL of the page.
 * @returns {*} Boolean.
 */
export function hasPagePermission(url) {
  return hasPermission(PAGE_PERMISSIONS, url);
}
