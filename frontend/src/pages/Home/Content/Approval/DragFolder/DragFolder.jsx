import { useState, useEffect } from 'react';
import styles from './DragFolder.module.css';
import { FaRegPlusSquare, FaRegMinusSquare, FaRegFolder  } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { DraggableEmployee } from '../../pages/Home/Content/Approval/ChoiceLine/DraggableEmployee';



export const DragFolder = ({ folder, level = 0 , onItemClick , selectedItem, setSelectedItem}) => {
    console.log(`폴더컴포넌트: ${selectedItem.children.name}`)
    const [isExpanded, setIsExpanded] = useState(false);

    // 폴더가 열려 있는 상태가 바뀌면 isExpanded 상태를 업데이트
    useEffect(() => {
        setIsExpanded(folder.isOpen || false);
    }, [folder.isOpen]);
  
    const handleToggle = () => {
      setIsExpanded(!isExpanded);
    };
  
  
    return (
      <div className={styles.folderContainer} style={{ marginLeft: `${level * 20}px` }}>
        <div className={styles.folderHeader} onClick={handleToggle}>
          {folder.children && folder.children.length > 0 && (
            isExpanded ? <FaRegMinusSquare /> : <FaRegPlusSquare />
          )}
          <span><FaRegFolder /></span><span className={styles.headerText}>{folder.name}</span>
        </div>
        {isExpanded && folder.children && folder.children.length > 0 && (
          <div className={styles.folderContent}>
          {folder.children.map((child, index) => (
                    <DraggableEmployee key={index} employee={child.name} onItemClick={onItemClick} selectedItem={selectedItem}>
                        <div className={styles.fileItem}>
                            <span><CiFileOn /></span>
                            <span
                                className={`${styles.contentText} ${selectedItem.children.name === child.name ? styles.selected : ''}`}>
                                {child.name}
                            </span>
                        </div>
                    </DraggableEmployee>
                ))}
          </div>
        )}
      </div>
    );
  };

