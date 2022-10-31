import { Typography, Alert } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalStorage } from "../../helpers";

import styles from "./form.module.css";

const AccessForm = ({ children, alert, title }) => {
  const navigate = useNavigate();

  useEffect(() => {
    getLocalStorage("sid") && navigate("/user");
  }, []);

  return (
    <div className={styles.container}>
      {alert.message && <Alert message={alert.message} type={alert.type} />}
      <Typography.Title
        className={styles.title}
        level={2}
        style={{ textAlign: "center" }}
      >
        {title}
      </Typography.Title>
      {children}
    </div>
  );
};

export default AccessForm;
