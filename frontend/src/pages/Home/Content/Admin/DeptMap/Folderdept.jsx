import { useState, useEffect } from 'react';
import styles from '../../../../../components/Folder/Folder.module.css'
import { FaRegPlusSquare, FaRegMinusSquare, FaRegFolder  } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";




export const Folderdept = ({ folder, level = 0, onItemClick, selectedItem, setSelectedItem, onFolderClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const isItemSelected = folder.children && folder.children.some(child => child.seq === selectedItem?.seq);
        if (isItemSelected) {
            setIsExpanded(true);
        }
    }, [selectedItem]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.folderContainer} style={{ marginLeft: `${level * 20}px` }}>
            <div className={styles.folderHeader} onClick={() => { handleToggle(); onFolderClick(folder); }}>
                {folder.children && folder.children.length > 0 && (
                    isExpanded ? <FaRegMinusSquare /> : <FaRegPlusSquare />
                )}
                <span><FaRegFolder /></span><span className={styles.headerText}>{folder.name}</span>
            </div>
            {isExpanded && folder.children && folder.children.length > 0 && (
                <div className={styles.folderContent}>
                    {folder.children.map((child, index) => (
                        <div key={index} className={styles.fileItem}>
                            <span><CiFileOn /></span> 
                            <span 
                                onClick={() => onItemClick(child)} 
                                className={`${styles.contentText} ${selectedItem?.seq === child.seq ? styles.selected : ''}`}>
                                {child.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
