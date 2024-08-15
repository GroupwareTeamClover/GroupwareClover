
import { useEffect, useState } from 'react';
import { Header } from '../Home/Header/Header'
import styles from './Admin.module.css'
import {PopupWindow} from '../Home/Content/Admin/PopupBoard/PopupContent/PopupWindow/PopupWindow'
import { AdminContent } from './AdminContent';

export const Admin = ()=>{

    const [showPopup, setShowPopup] = useState(false);

    useEffect(()=>{
        setShowPopup(true);
    },[]);

    
    return (
        <div className={styles.container}>
            <Header /> 
            <AdminContent />
            {showPopup && <PopupWindow setShowPopup={setShowPopup} />}
        </div>
    )
    
}