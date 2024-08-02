import styles from './Business.module.css'
import { BsChevronDoubleLeft } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { useMemberStore } from '../../../../../../../store/store';

export const Business =({type, docinfo, empinfo})=>{
   console.log(empinfo);
    // lineinfo의 apvchoice 배열을 순회하며 객체 정보 출력
    // lineinfo.apvchoice?.map((line, index) => {
    //     console.log(line.department);
    //     console.log(line.name);
    //     console.log(line.role);
    // });

    //세션정보
    const {sessionData} = useMemberStore();

    //현재시간 마운트 시 한번만
    const [currentTime, setCurrentTime] = useState('');
    useEffect(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, []); 

    //insert axios
    
    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <span><h2>{type}</h2></span>
            </div>
            <div className={styles.bigcontent}>
                {/* 내용 첫번째 줄 */}
                <div className={styles.info}> 
                    <div className={styles.docInfo}>
                        <div className={styles.tablebox}>
                            <div className={styles.row1}>
                            <div className={styles.row1col1}>기안자</div>
                            <div className={styles.row1col2}>{sessionData.empName}</div>
                            </div>
                            <div className={styles.row2}>
                            <div className={styles.row2col1}>소속</div>
                            <div className={styles.row2col2}>값</div>
                            </div>
                            <div className={styles.row3}>
                            <div className={styles.row3col1}>기안일</div>
                            <div className={styles.row3col2}>{currentTime}</div>
                            </div>
                            <div className={styles.row4}>
                            <div className={styles.row4col1}>문서번호</div>
                            <div className={styles.row4col2}></div>
                            </div>
                        </div>
                    </div>
                    {/* <div className={styles.apvlineInfo}> */}
                        {empinfo.apvchoice && empinfo.apvchoice.length > 0 && (
                                <div className={styles.apvlineInfo}>
                                    {empinfo.apvchoice.map((line, index) => (
                                        <div key={index} className={styles.tablelbox2}>
                                            <div className={styles.role}><span className={styles.roleText}>{line.role}</span></div>
                                            <div className={styles.name}><span className={styles.nameText}>{line.name}</span></div>
                                            <div className={styles.docNumber}>결재상태예정</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    {/* </div> */}
                </div>
                {/* 내용 두번째 줄 */}
                <div className={styles.content}>
                    <div className={styles.datatitle}>
                        <div className={styles.date}>
                            <div className={styles.name}>시행일자</div>
                            <div className={styles.value}>
                                <input type='date'></input>
                            </div>

                        </div>
                        <div className={styles.title}>
                            <div className={styles.name}>제목</div>
                            <div className={styles.value}>
                                <input type='text'></input>
                            </div>
                        </div>
                    </div>
                    <div className={styles.detail}>

                    </div>
                </div>
            </div>
        </div>
    )
}


{/* docinfo내용
    <div className={styles.row1}>
<div className={styles.row1col1}>기안자</div>
<div className={styles.row1col2}>값</div>
</div>
<div className={styles.row2}>
<div className={styles.row2col1}>소속</div>
<div className={styles.row2col2}>값</div>
</div>
<div className={styles.row3}>
<div className={styles.row3col1}>기안일</div>
<div className={styles.row3col2}>값</div>
</div>
<div className={styles.row4}>
<div className={styles.row4col1}>문서번호</div>
<div className={styles.row4col2}>값</div>
</div> */}