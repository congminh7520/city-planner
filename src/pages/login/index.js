import { useState } from "react";
import axios from "axios";
import config from "../../config";
import AccessForm from "../../components/AccessForm";
import LoginForm from "../../components/LoginForm";
import { setLocalStorage } from "../../helpers";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

const Login = () => {
  const navigate = useNavigate();
  const initAlert = {
    message: "",
    type: "",
  };
  const [alert, setAlert] = useState(initAlert);
  const [isLoad, setIsLoad] = useState(false);

  const submitForm = async (payload) => {
    const { url, method } = config.paths.login;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        data: payload,
      });
      data.status !== 200 && setAlert({ message: data.message, type: "error" });
      if (data.status === 200) {
        setLocalStorage("sid", data.token);
        setLocalStorage("rid", data.refreshToken);
        navigate("/user");
        setAlert(initAlert);
      }
      setIsLoad(false);
    } catch (e) {
      setIsLoad(false);
      setAlert({ message: e.message, type: "error" });
    }
  };

  return (
    <AccessForm title="Login" alert={alert}>
      {isLoad && <Loading />}
      <LoginForm onSubmit={submitForm} />
    </AccessForm>
  );
};

export default Login;
