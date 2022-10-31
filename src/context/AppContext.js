import axios from "axios";
import { createContext, useEffect, useState } from "react";
import config from "../config";
import { getLocalStorage } from "../helpers";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  // Get token at the first time page loaded
  useEffect(() => {
    setToken(getLocalStorage("sid"));
  }, [getLocalStorage("sid")]);

  useEffect(() => {
    handleFetchUserPayload();
  }, [token]);

  const handleFetchUserPayload = async () => {
    const { url, method } = config.paths.getInfo;
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        // handle authorization for the first time access via login
        headers: {
          Authorization: `token ${token}`,
        },
      });
      data.status === 200 && setUser(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  return <AppContext.Provider value={{ user }}>{children}</AppContext.Provider>;
};

export default AppContext;
