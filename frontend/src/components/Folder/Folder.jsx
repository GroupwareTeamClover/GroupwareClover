import { useState, useEffect } from 'react';
import styles from './Folder.module.css'
import { FaRegPlusSquare, FaRegMinusSquare, FaRegFolder  } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";

//검색기능까지 할 거라면 Approval/ChoiceForm확인

//넣어야 할 데이터 모습
// const folderData=[
//     {
//         name: "일반",
//         children: [{name :"업무기안"}]
//     },
//     {
//         name: "인사",
//         children: [{name: "휴가신청서"},{name:"연차신청서"}]
//     }
// ]

//적용방법
/* <div className={styles.searchContent}>
    {folderData.map((folder, index) => (
        <Folder key={index} folder={folder} />
    ))}
</div> */


export const Folder = ({ folder, level = 0 , onItemClick , selectedItem, setSelectedItem}) => {
    // console.log(`양식폴더컴포넌트: ${selectedItem.children.name}`)
    const [isExpanded, setIsExpanded] = useState(false);


  // 폴더가 열려야 하는지 확인합니다
  useEffect(() => {
    // 선택된 항목이 현재 폴더의 자식인지 확인
    const isItemSelected = folder.children && folder.children.some(child => child.name === selectedItem.children.name);

      if (isItemSelected) {
        setIsExpanded(true);
      }
    }, [selectedItem]);
  
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
              <div key={index} className={styles.fileItem}>
                <span><CiFileOn /></span> 
                <span 
                  onClick={() => onItemClick(child)} 
                  className={`${styles.contentText} ${selectedItem.children.name === child.name ? styles.selected : ''}`}>
                    {child.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };