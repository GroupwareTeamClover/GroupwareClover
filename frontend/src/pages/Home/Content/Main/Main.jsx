import styles from './Main.module.css'

export const Main = () => {
  return (
    <div className={styles.container}>
      <div className={styles.col}>
        <div className={styles.myInfo}>마이페이지</div>
        <div className={styles.attendance}>근태</div>
        <div className={styles.todo}>Todo List</div>
      </div>
      <div className={styles.col}>
        <div className={styles.review}>
          뭐 넣지?
        </div>
      </div>
    </div>
  );
}