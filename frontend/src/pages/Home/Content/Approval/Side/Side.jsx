import styles from './Side.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import {useEffect, useState} from "react";
import { BigModal } from '../BigModal/BigModal'
import { ChoiceForm } from '../ChoiceForm/ChoiceForm';
import { ChoiceLine } from '../ChoiceLine/ChoiceLine';
import { useApprovalStore } from '../../../../../store/approvalStore';


export const Side = () => {
    const {selectedDocCode, selectedEmpInfo, resetSelectedEmpInfo, resetSelectedDocCode}=useApprovalStore();

    const navi = useNavigate();
   
    const [ modalState, setModalState ] = useState(""); //새결재진행하기
    const [isComplete, setIsComplete] = useState(false); // 완료 여부 추적


    //화면 url, 상태 navi에 넣기
    const handleNavigation = (path, type) => {
        navi(path, { state: { type } });
    };

    const handleWriteNavigation = (path, type, docinfo, empinfo) => {
        navi(path, { state: { type, docinfo, empinfo } });
    };
    
    
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);

    // const closeModal = () => setIsModalOpen(false);
    // 모달을 닫을 때 데이터 초기화
    const closeModal = () => {
        setModalState("");
        setPage(1);
        setIsModalOpen(false);
        resetSelectedEmpInfo();
        resetSelectedDocCode();
    };
    
    //새 결재 클릭시 모달창 띄우기
    const handleModalChange = (e) => {
      setModalState(e.target.name); //새결재진행하기
      setPage(1);
      openModal();
    }

    //모달 페이지 변환
    const [Page, setPage] = useState(1);

    const handlePageChange = (e) =>{
        setPage(prev => {
          if(e.target.name === "prev") {
            if(prev === 1) return 1;
            else return prev - 1;
          } else {
            if(prev === 2) return 2;
            else return prev + 1;
          }
        });
    }


    // 전자결재양식선택에서 다음을 클릭할 때 양식을 선택해야지만 다음으로 넘어가도록 예외 처리
    const handleFormNext = (event) => {
        //다음으로 넘어가는 조건
        if(selectedDocCode.name){
            handlePageChange(event);
          
        }else{
            alert("결재 양식을 선택하세요.");
        }
    }

    //확인 클릭 시 문서 생성
    const handleAdd = () =>{
        //모달창닫기
        //이거 안하면 writepage넘어가서 새결재하기 눌렀을 때 작동안함
        setIsComplete(true); 
    }


    useEffect(() => {
        if (isComplete) {
            const path = selectedDocCode.children.name === '업무기안' ? 'business' :
            selectedDocCode.children.name === '휴가신청서' ? 'dayoff' :
            'invalid';

             // selectedDocCode의 깊은 복사본 생성 카피의 복사본이냐 원본의 복사본이냐?...
             //이유: 이걸 하지 않으면 메인에서 모달창을 띄울때와 writeForm에서 모달창을 띄울때 구분할 수 없게된다.
             //예를 들어. selectedDocCode를 writeform에서도 사용될 경우
             //양식이 변경될때마다 제목과 밑에 컴포넌트, 결재라인까지 함께 변경되어 버려서 새 결재 진행같은 느낌이 들지 않음
             const clonedDocName = structuredClone(selectedDocCode.children.name);
             const clonedDocCode = structuredClone(selectedDocCode);
             const clonedLineInfo = structuredClone(selectedEmpInfo);
             console.log(`원본: ${JSON.stringify(selectedEmpInfo, null, 2)}`);
             console.log(`복사: ${JSON.stringify(clonedLineInfo, null, 2)}`);
             
            handleWriteNavigation(`/approval/write/${path}`, clonedDocName, clonedDocCode, clonedLineInfo); // 페이지 다시 로드
            closeModal();
            setIsComplete(false); 
          
        }
    }, [isComplete]);


    return (
        <div className={styles.sideBox}>
            <div className={styles.textBox} onClick={() => handleNavigation('/approval', '전자결재')}>전자결재</div>
            <div className={styles.btnBox}>
                <button className={styles.addBtn} onClick={handleModalChange} name="ModalForm">새 결재 진행하기</button>
            </div>
            <div className={styles.proceedingBox}>
                <div className={styles.boxtext}>진행중 문서</div>
                <div className={styles.menuBox}>
                    <div className={styles.menu} onClick={() => handleNavigation('/approval/proceeding', '기안진행')}>
                        <span className={styles.menutext}>기안진행</span>
                    </div>
                    <div className={styles.menu} onClick={() => handleNavigation('/approval/waiting', '결재대기')}>
                        <span className={styles.menutext}>결재대기</span>
                    </div>
                    <div className={styles.menu} onClick={() => handleNavigation('/approval/planning', '결재예정')}>
                        <span className={styles.menutext}>결재예정</span>
                    </div>
                    <div className={styles.menu} onClick={() => handleNavigation('/approval/receiving', '결재수신')}>
                        <span className={styles.menutext}>결재수신</span>
                    </div>
                    <div className={styles.menu} onClick={() => handleNavigation('/approval/participating', '참조/열람 대기')}>
                        <span className={styles.menutext}>참조/열람 대기</span>
                    </div>
                </div>
            </div>
            <div className={styles.docBox}>
                <div className={styles.boxtext}>문서함</div>
                <div className={styles.menuBox}>
                    <div className={styles.menu} onClick={() => handleNavigation('/approval/drafting', '기안문서함')}>
                        <span className={styles.menutext}>기안문서함</span>
                    </div>
                    <div className={styles.menu} onClick={() => handleNavigation('/approval/temp', '임시문서함')}>
                        <span className={styles.menutext}>임시문서함</span>
                    </div>
                    <div className={styles.menu} onClick={() => handleNavigation('/approval/complete', '결재문서함')}>
                        <span className={styles.menutext}>결재문서함</span>
                    </div>
                    <div className={styles.menu} onClick={() => handleNavigation('/approval/received', '수신문서함')}>
                        <span className={styles.menutext}>수신문서함</span>
                    </div>
                    <div className={styles.menu} onClick={() => handleNavigation('/approval/participated', '참조/열람 문서함')}>
                        <span className={styles.menutext}>참조/열람 문서함</span>
                    </div>
                </div>
            </div>
            
            {/* 모달창 */}
            <BigModal isOpen={isModalOpen} onClose={closeModal}>
                <div className={styles.modalForm}>
                    {modalState === "ModalForm" && (
                        <>
                            {Page === 1 && (
                                <>
                                <ChoiceForm Page={Page}/> 
                                <div className={styles.modalbtnBox}>
                                    <button name="prev" onClick={handlePageChange} className={styles.btn}> 이전</button>
                                    <button name="next" onClick={handleFormNext} className={styles.btn} > 다음</button>
                                </div>
                                </>
                            )}
                            {Page === 2 && (
                                <>
                                <ChoiceLine Page={Page}/>
                                <div className={styles.modalbtnBox}>
                                    <button name="prev" onClick={handlePageChange} className={styles.btn}> 이전</button>
                                    <button name="next" onClick={handlePageChange} className={styles.btn}> 다음</button>
                                    <button name="comp" className={styles.btn} onClick={handleAdd}>확인</button>
                                </div>
                                </>
                            )}
                         
                        </>
                    )}
                </div>
            </BigModal>
        </div>
    );
};
