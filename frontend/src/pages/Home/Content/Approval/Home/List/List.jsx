import styles from './List.module.css';


export const List=({type})=>{
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>{type}</h3>
            </div>
            <div className={styles.menu}></div>
            <div className={styles.content}></div>
        </div>
    )
}