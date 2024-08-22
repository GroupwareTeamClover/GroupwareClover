import styles from './NotFount.module.css';

const NotFound = () => {
    return(
        <div className={styles.container}>Page Not Found : 올바르지 않은 URL입니다.  <br></br> 정상적인 경로로 접속해주세요.</div>
    )
}

export default NotFound;