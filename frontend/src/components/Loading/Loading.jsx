import styles from './Loading.module.css'

export const Loading = () => {
    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
            <p>잠시만 기다려주세요..</p>
        </div>
    );
}