import { useState, useEffect } from 'react';
import styles from './Folderdept.module.css'
import { FaRegPlusSquare, FaRegMinusSquare, FaRegFolder, FaUser, FaBuilding, FaRegBuilding  } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";




export const Folderdept = ({ folder, level = 0, onItemClick, selectedItem, setSelectedItem, onFolderClick, isFiltered}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (isFiltered) {
            setIsExpanded(true);
        } else {
            const isItemSelected = folder.children && folder.children.some(child => child.seq === selectedItem?.seq);
            if (isItemSelected) {
                setIsExpanded(true);
            }
            else {
                setIsExpanded(false);
            }
        }
    }, []);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    // console.log(folder.children)

    return (
        <div className={styles.folderContainer} style={{ marginLeft: `${level * 20}px` }}>
            <div className={styles.folderHeader} onClick={() => { handleToggle(); onFolderClick(folder); }}>
                {folder.children && folder.children.length > 0 && 
                    folder.children.some(child => child.name !== undefined) &&
                (
                    isExpanded ? <FaRegMinusSquare /> : <FaRegPlusSquare />
                )}
                <span><FaRegBuilding /></span><span className={styles.headerText}>{folder.name}</span>
            </div>
            {isExpanded && folder.children && folder.children.length > 0 && (
                <div className={styles.folderContent}>
                    {folder.children.map((child, index) => (
                        (child.name !== undefined ? 
                        <div key={index} className={styles.fileItem}>
                            <span><FaUser size={15} color="rgba(139, 139, 196, 0.726)"/></span> 
                            <span 
                                onClick={() => onItemClick(child)} 
                                className={`${styles.contentText} ${selectedItem?.seq === child.seq ? styles.selected : ''}`}>
                                {child.name} {child.role}
                            </span>
                        </div>
                        : '')
                    ))}
                </div>
            )}
            
        </div>
    );
};
