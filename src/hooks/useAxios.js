import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import config from "../config";

export default function useAxios(url, method, data, params) {
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState();
  const [error, setError] = useState();

  const fetch = () => {
    setLoading(true);
    return axios({
      url: `${config.app.apiHost}${url}`,
      method,
      params,
      data,
    })
      .then((res) => {
        if (res.data?.status !== 200) return setError(res.data);
        setPayload(res.data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (method === "GET") {
      fetch();
    }
  }, []);

  return { loading, payload, error, fetch };
}
