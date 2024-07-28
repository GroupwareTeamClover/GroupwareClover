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


export const Folder = ({ folder, level = 0 }) => {
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
          <span><FaRegFolder /></span><span>{folder.name}</span>
        </div>
        {isExpanded && folder.children && folder.children.length > 0 && (
          <div className={styles.folderContent}>
            {folder.children.map((child, index) => (
              <div key={index} className={styles.fileItem}>
                <span><CiFileOn /></span> <span>{child.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };