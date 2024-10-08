import styles from './Loading.module.css';
import loading from '../../images/loading.gif';

export const Loading = () => {
    return (
        <div className={styles.container}>
          <img src={loading} alt="loading" className={styles.loading}/>
        </div>
    );
}