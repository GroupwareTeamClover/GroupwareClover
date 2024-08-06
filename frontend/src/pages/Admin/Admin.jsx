
import { useState } from 'react';
import { Content } from '../Home/Content/Content'
import { Header } from '../Home/Header/Header'
import styles from './Admin.module.css'
import {PopupWindow} from '../Home/Content/Admin/PopupBoard/PopupContent/PopupWindow/PopupWindow'

export const Admin = ()=>{

    const [showPopup, setShowPopup] = useState(true);

    return (
        <div className={styles.container}>
            <Header /> 
            <Content />
            {showPopup && <PopupWindow setShowPopup={setShowPopup} />}
        </div>
    )
    
}