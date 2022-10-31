import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AccessForm from "../../components/AccessForm";
import config from "../../config";
import RegisterForm from "../../components/RegisterForm";
import Loading from "../../components/Loading";

const Register = () => {
  const navigate = useNavigate();
  const initAlert = {
    message: "",
    type: "",
  };
  const [alert, setAlert] = useState(initAlert);
  const [isLoad, setIsLoad] = useState(false);

  const handleRegister = async (payload) => {
    const { url, method } = config.paths.register;
    setIsLoad(false);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        data: payload,
      });
      if (data.status === 200) {
        setAlert({
          message:
            "Successfully register new account, please return to login page to access to dashboard",
          type: "success",
        });
        setIsLoad(false);
      }
      data.status !== 200 && setAlert({ message: data.message, type: "error" });
    } catch (err) {
      setIsLoad(false);
      setAlert({ message: err.message, type: "error" });
    }
  };

  const submitForm = (data) => {
    handleRegister(data);
  };

  return (
    <AccessForm title="Register" alert={alert}>
      {isLoad && <Loading />}
      <RegisterForm isRegister onSubmit={submitForm} />
    </AccessForm>
  );
};

export default Register;
