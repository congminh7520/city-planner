import { Typography } from "antd";
import styles from "./dashboard.module.css";

const DashboardContentLayout = ({ children, title, prefix }) => {
  return (
    <div className={styles.contentWrapper}>
      <div className={styles.header}>
        {title && (
          <Typography.Title className={styles.title}>{title}</Typography.Title>
        )}
        <div className={styles.prefix}>{prefix}</div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default DashboardContentLayout;
