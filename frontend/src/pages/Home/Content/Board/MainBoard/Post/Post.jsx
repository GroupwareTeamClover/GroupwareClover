import styles from './Post.module.css';
import { GoStar } from "react-icons/go";
import defaultImage from '../../../../../../images/default_avatar.jpg'
import { IconContext } from "react-icons";
import { LuEye } from "react-icons/lu";

const Post = () => {
    return (
        <div className={styles.post}>
            <div className={styles.star}>
                <IconContext.Provider value={{ color: "#000000", className: styles.starIcon }}>
                    <GoStar size="20" />
                </IconContext.Provider>
            </div>
            <div className={styles.title}>제목이 표시될 공간입니다.</div>
            <div className={styles.writer}>
                <div className={styles.userAvatar}>
                    <img src={defaultImage} alt="기본 이미지" />
                </div>
                작성자
            </div>
            <div className={styles.date}>24.08.01</div>
            <div className={styles.view}><LuEye />&nbsp;150</div>
        </div>
    );
}

export default Post;