
import styles from './Member.module.css';


export const Member = () => {

    return (
      <div className={styles.container}>
        <div className={styles.header}>
            조직관리
            <div className={styles.member_info}>
                <div className={styles.member_total}>
                    사원 수 : "멤버 N" 명
                </div>
                <div className={styles.member_detail}>
                    정상("멤버 M"명 / 휴면 "M-m"명) 중지 "N-M"명
                </div>
            </div>
        </div>
        <div className={styles.body}>
            <div className={styles.row_header}>
                <div className={styles.col_button}>

                </div>
                <div className={styles.col_search}>

                </div>
            </div>
            <div className={styles.row_body}>

            </div>
            <div className={styles.pagenation}>

            </div>
        </div>
      </div>
    );
  }