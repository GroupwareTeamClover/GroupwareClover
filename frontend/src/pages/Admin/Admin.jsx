
import { Content } from '../Home/Content/Content'
import { Header } from '../Home/Header/Header'
import styles from './Admin.module.css'


export const Admin = ()=>{

    return (
        <div className={styles.container}>
            <Header /> 하이
            <Content />
        </div>
    )
    
}