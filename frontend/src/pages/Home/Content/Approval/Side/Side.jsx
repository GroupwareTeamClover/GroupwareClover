import styles from './Side.module.css';
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import { Modal } from '../../../../../components/Modal/Modal';
import { BigModal } from '../BigModal/BigModal'
import { ChoiceForm } from '../ChoiceForm/ChoiceForm';
import { ChoiceLine } from '../ChoiceLine/ChoiceLine';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';

export const Side = () => {
    const navi = useNavigate();
   
    const [ modalState, setModalState ] = useState(""); //새결재진행하기

    //화면 url, 상태 navi에 넣기
    const handleNavigation = (path, type) => {
        navi(path, { state: { type } });
    };

    const handleWriteNavigation = (path, type, data) =>{
        navi(path, {state: { type, data} })
    }

    
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const openModal = () => setIsModalOpen(true);

    // const closeModal = () => setIsModalOpen(false);
    // 모달을 닫을 때 데이터 초기화
    const closeModal = () => {
        setModalState("");
        setPage(1);
        setSelectedDocCode({ name: '', children: { name: '', period: 0 } });//초기화
        setSelectedEmpInfo({ apvchoice: [], recchoice: [], refchoice: [] });//초기화
        setIsModalOpen(false);
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

    //모달사이 전달할 정보저장
    const [selectedDocCode, setSelectedDocCode] = useState({ name: '', children: { name: '', period: 0, detailcode: 0 } });
    const [selectedEmpInfo, setSelectedEmpInfo] = useState({ apvchoice: [], refchoice: [], viechoice: [], recchoice: []});

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
        // console.log(selectedDocCode);
        // console.log(selectedEmpInfo);
        axios.post(`${BaseUrl()}/document`, {
            selectedDocCode:selectedDocCode,
            selectedEmpInfo:selectedEmpInfo
        }).then((resp)=>{
            //응답으로 문서 정보 받아서 writeForm으로 이동시키기
            const data=resp.data

            const combinedData = {
                docdto: data.docdto,
                apvlist: data.apvlist,
                plist: data.plist
            };
            
            //모달창 닫기
            closeModal();
            //wirteForm으로 정보가지고 이동
            handleWriteNavigation('/approval/write', data.docDetailName, combinedData)
    
        }).catch((error) => {
            alert("전자결재 문서 생성 실패");
        });

    }

    // console.log(`문서 dto: ${JSON.stringify(docdto, null, 2)}`);
    // console.log(`문서 양식 이름: ${JSON.stringify(docDetailName, null, 2)}`);
    // console.log(`결재라인: ${JSON.stringify(apvlist, null, 2)}`);
    // console.log(`참여자라인: ${JSON.stringify(plist, null, 2)}`);


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
                                <ChoiceForm Page={Page} selectedDocCode={selectedDocCode} setSelectedDocCode={setSelectedDocCode} /> 
                                <div className={styles.modalbtnBox}>
                                    <button name="prev" onClick={handlePageChange} className={styles.btn}> 이전</button>
                                    <button name="next" onClick={handleFormNext} className={styles.btn} > 다음</button>
                                </div>
                                </>
                            )}
                            {Page === 2 && (
                                <>
                                <ChoiceLine Page={Page} selectedDocCode={selectedDocCode}  selectedEmpInfo={selectedEmpInfo} setSelectedEmpInfo={setSelectedEmpInfo} />
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
