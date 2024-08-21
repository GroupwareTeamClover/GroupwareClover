import { useState, useEffect } from 'react';
import styles from './ChatFolder.module.css';
import { FaRegPlusSquare, FaRegMinusSquare, FaRegFolder } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";

export const ChatFolder = ({ folder, level = 0, onItemClick, selectedItem, isFiltered }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // 검색 결과에 따라 자동으로 폴더를 열어줌
        if (isFiltered) {
            setIsExpanded(true);
        } else {
            // 선택된 항목이 현재 폴더의 자식인지 확인
            const isItemSelected = folder.children && folder.children.some(child => child.seq === selectedItem.children.seq);
            if (isItemSelected) {
                setIsExpanded(true);
            } else {
                setIsExpanded(false);
            }
        }
    }, [selectedItem, isFiltered, folder.children]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.folderContainer} style={{ marginLeft: `${level * 20}px` }}>
            <div className={styles.folderHeader} onClick={handleToggle}>
                {folder.children && folder.children.length > 0 && (
                    isExpanded ? <FaRegMinusSquare /> : <FaRegPlusSquare />
                )}
                
                <span className={styles.headerText}>{folder.name} ({folder.children.length})</span>
            </div>
            {isExpanded && folder.children && folder.children.length > 0 && (
                <div className={styles.folderContent}>
                    {folder.children.map((child, index) => (
                        <div
                            key={index}
                            className={`${styles.childItem} ${selectedItem.children.seq === child.seq ? styles.selected : ''}`}
                            onClick={() => onItemClick(child)}
                        >
                            {child.avatar && (
                                <img src={child.avatar} alt={`${child.name}의 아바타`} className={styles.avatar} />
                            )}
                            <div className={styles.childInfo}>
                                <div className={styles.childName}>
                                    {child.name}
                                </div>
                                <div className={styles.childRole}>{child.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
