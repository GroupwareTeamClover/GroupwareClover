import styles from './Side.module.css';
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import { Modal } from '../../../../../components/Modal/Modal';
import { BigModal } from '../BigModal/BigModal'
import { ChoiceForm } from '../ChoiceForm/ChoiceForm';
import { ChoiceLine } from '../ChoiceLine/ChoiceLine';

export const Side = () => {
    const navi = useNavigate();

    //화면 url, 상태 navi에 넣기
    const handleNavigation = (path, type) => {
        navi(path, { state: { type } });
    };

    //새 결재 클릭시 모달창 띄우기
    const [ modalState, setModalState ] = useState("");
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleModalChange = (e) => {
      setModalState(e.target.name);
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

    //모달사이 전달할 정보저장
    const [selectedDocCode, setSelectedDocCode] = useState({ name: '', children: { name: '', period: 0 } });
    const [selectedEmpInfo, setSelectedEmpInfo] = useState({ name: '', children: { name: '', role: '' } });

    return (
        <div className={styles.sideBox}>
            <div className={styles.textBox} onClick={() => handleNavigation('/', '전자결재')}>전자결재</div>
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
                                <ChoiceForm Page={Page} selectedDocCode={selectedDocCode} setSelectedDocCode={setSelectedDocCode} /> 
                                <div className={styles.modalbtnBox}>
                                    <button name="prev" onClick={handlePageChange} className={styles.btn}> 이전</button>
                                    <button name="next" onClick={handlePageChange} className={styles.btn}> 다음</button>
                                </div>
                                </>
                            )}
                            {Page === 2 && (
                                <>
                                <ChoiceLine Page={Page} selectedDocCode={selectedDocCode}  selectedEmpInfo={selectedEmpInfo} setSelectedEmpInfo={setSelectedEmpInfo} />
                                <div className={styles.modalbtnBox}>
                                    <button name="prev" onClick={handlePageChange} className={styles.btn}> 이전</button>
                                    <button name="next" onClick={handlePageChange} className={styles.btn}> 다음</button>
                                    <button name="comp" className={styles.btn}>확인</button>
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
