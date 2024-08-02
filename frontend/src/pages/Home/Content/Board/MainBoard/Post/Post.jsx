import styles from './Post.module.css';
import { GoStar } from "react-icons/go";
import defaultImage from '../../../../../../images/default_avatar.jpg'
import { IconContext } from "react-icons";
import { LuEye } from "react-icons/lu";

const Post = ({ title, writer, date, view }) => {
    return (
        <div className={styles.post}>
            <div className={styles.star}>
                <IconContext.Provider value={{ color: "#000000", className: styles.starIcon }}>
                    <GoStar size="20" />
                </IconContext.Provider>
            </div>
            <div className={styles.title}>{title}</div>
            <div className={styles.writer}>
                <div className={styles.userAvatar}>
                    <img src={defaultImage} alt="기본 이미지" />
                </div>
                {writer}
            </div>
            <div className={styles.date}>{date}</div>
            <div className={styles.view}><LuEye />&nbsp;{view}</div>
        </div>
    );
}

export default Post;