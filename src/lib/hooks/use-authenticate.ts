import Cookies from "js-cookie";

export const useAuthenticate = () => {
  const token = Cookies.get("token");

  if (!!token) {
    return true;
  } else {
    return false;
  }
};
