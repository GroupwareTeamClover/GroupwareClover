import styles from './Home.module.css'
import {Header} from "./Header/Header";
import {Content} from "./Content/Content";

export const Home = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Content />
    </div>
  );
}