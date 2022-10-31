import Spinner from "../Spinner";
import styles from "./loading.module.css";

const Loading = () => {
  return (
    <div className={styles.overlay}>
      <Spinner />
    </div>
  );
};

export default Loading;
