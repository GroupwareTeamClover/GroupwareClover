import { useEffect, useState } from 'react';
import styles from './ModalDept.module.css'
import { BiHelpCircle } from 'react-icons/bi';
import axios from 'axios';
import { BaseUrl } from '../../../../../../commons/config';
import { smallAlert, smallConfirmAlert } from '../../../../../../commons/common';

export const ModalDept =({setIsModalOpen, onDeptAdded })=>{

    const [deptName, setDeptName] = useState();
    const [deptCode, setDeptCode] = useState();
    const [existingDeptCodes, setExistingDeptCodes] = useState([]);

    const closeModal = () => setIsModalOpen(false);

    useEffect(()=>{
        // 테이블에 존재하는 부서코드, 부서이름 가져오기. (같은 코드, 이름 있으면 막기 위해서)
        axios.get(`${BaseUrl()}/adminmember/deptName`).then((resp) => {
            setExistingDeptCodes(resp.data.map(code => ({DEPT_CODE:code.DEPT_CODE, DEPT_NAME:code.DEPT_NAME}))); 
        });
    },[])
    const handleSave = () => {
        if(!deptName){
            smallAlert("부서명을 입력하세요.");
            return;
        }
    
        let existingDeptName = existingDeptCodes.some(name => name.DEPT_NAME === deptName);
        if(existingDeptName){
            smallAlert("이미 존재하는 부서명입니다. 다른 부서명을 입력하세요");
            return; 
        }
    
        let existingDeptCode = existingDeptCodes.some(code => code.DEPT_CODE === deptCode);
        if(deptCode && existingDeptCode){
            smallAlert("이미 존재하는 부서코드입니다. 다른 부서코드를 입력하시거나 비워주세요");
            return; //
        } else if (!deptCode) {
            let minDeptCode = 1;
            while (existingDeptCodes.some(code=> code.DEPT_CODE === minDeptCode)) {
                minDeptCode++;
            }
            setDeptCode(minDeptCode);
            // handleAxios(deptName, minDeptCode);
            
            axios.post(`${BaseUrl()}/adminmember/addDept`, {deptName, minDeptCode}).then((resp)=>{
                const newDept = { name: deptName, children: [] };
                onDeptAdded(newDept);
                closeModal();
                smallAlert(`부서명: ${deptName}, 부서코드: ${minDeptCode}인 부서가 추가되었습니다.`)
            })
            
        }

        
    }
    
    

    return(
        <div className={styles.container}>
            <div className={styles.title}>
                부서 추가
            </div>
            <div className={styles.changeStatus}>
                <div className={styles.statusTitle}>
                부서명 <span style={{color:'red'}}>*</span> 
                </div>
                <div className={styles.statusSelect}>
                    <input type='text' name='deptname' value={deptName ||''} onChange={(e) => setDeptName(e.target.value)}></input>                  
                </div>
                {/* <button className={styles.checkBtn}>중복확인</button> */}
            </div>
            <div className={styles.changeStatus}>
                <div className={styles.statusTitle}>
                   부서 코드 
                </div>
                <div className={styles.statusSelect}>
                    <input type='text' name='deptcode' value={deptCode ||''} 
                    placeholder='부서코드는 자동 생성됩니다.'
                    disabled
                    onChange={(e) =>{
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                            setDeptCode(value);
                        }
                    }}
                    onKeyDown={(e) => {
                        // 숫자 키(0-9), 백스페이스, 삭제, 화살표 키 등을 제외한 키 입력을 막음
                        if (
                            !(
                                (e.key >= '0' && e.key <= '9') || // 숫자 키
                                e.key === 'Backspace' || // 백스페이스 키
                                e.key === 'Delete' || // Delete 키
                                e.key === 'ArrowLeft' || // 왼쪽 화살표 키
                                e.key === 'ArrowRight' || // 오른쪽 화살표 키
                                e.key === 'Tab' || // Tab 키
                                e.key === 'Enter' // Enter 키
                            )
                        ) {
                            e.preventDefault(); // 이외의 키 입력 방지
                        }}}
                    ></input> 
                </div>
            </div>  
            <div className={styles.changeStatus}>
                <div className={styles.statusHelp}>
                   {/* (입력하지 않을 시, 부서코드가 자동 생성됩니다.) */}
                </div>
            </div>            
            <div className={styles.btnstyle}>
                <button className={styles.save} onClick={handleSave}>저장</button>
                <button className={styles.cancel} onClick={closeModal}>취소</button>
            </div>
        </div>

    )
}