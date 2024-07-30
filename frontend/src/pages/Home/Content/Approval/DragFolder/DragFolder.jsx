import { useState, useEffect } from 'react';
import styles from './DragFolder.module.css';
import { FaRegPlusSquare, FaRegMinusSquare, FaRegFolder  } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";

export const DragFolder = ({ folder, level = 0 , onItemClick , selectedItem, setSelectedItem,  setDraggingItem, isDragging, setIsDragging}) => {
  // console.log('드래그 폴더 selecteditem:', JSON.stringify(selectedItem, null, 2))
    
    const [isExpanded, setIsExpanded] = useState(false);

    const isItemSelected = (child) => {
      const allChoices = [...selectedItem.apvchoice, ...selectedItem.recchoice, ...selectedItem.refchoice];
      return allChoices.some(choice => choice.name === child.name);
    };

  // 선택된 자식이 있는지 확인하는 함수
  const isAnyChildSelected = (children) => {
    return children.some(child => isItemSelected(child));
  };

  // 폴더 열림 상태 업데이트
    useEffect(() => {
      setIsExpanded(isAnyChildSelected(folder.children) || folder.isOpen || false);
    }, [folder.isOpen, selectedItem]);

    const handleToggle = () => {
      setIsExpanded(!isExpanded);
    };

    const handleDragStart = (event, item) => {
      setIsDragging(true);
      setDraggingItem(item);

      event.dataTransfer.setData('application/json', JSON.stringify({
          item,
          department: folder.name 
      }));

  
    };

    const handleClick = (event, item) => {
      if (isDragging) {
          event.preventDefault();
          event.stopPropagation();
          return;
      }
      onItemClick(item);
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
              <div 
                key={index} 
                className={`${styles.fileItem} `}  
                draggable 
                onDragStart={(event) => handleDragStart(event, child)}  
                onClick={(event) => handleClick(event, child)}
              >
                <span><CiFileOn /></span> 
                <span className={`${styles.contentText} ${isItemSelected(child) ? styles.selected : ''}`}>
                    {`${child.name} ${child.role}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
};
