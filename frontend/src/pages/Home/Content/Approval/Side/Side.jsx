import styles from './Side.module.css';
import { ChoiceLine } from './ChoiceLine/ChoiceLine';
import { ChoiceForm } from './ChoiceForm/ChoiceForm';
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import { BigModal } from './BigModal/BigModal'
import { useApprovalStore } from '../../../../../store/approvalStore';

//현재 url approval/*
export const Side = () => {
    const {selectedDocCode, selectedEmpInfo, resetSelectedEmpInfo, resetSelectedDocCode, cloneDocCode, setCloneDocCode, cloneEmpInfo, setCloneEmpInfo, setIsModalComplete, isModalComplete}=useApprovalStore();

    const navi = useNavigate();
   
    const [ modalState, setModalState ] = useState("");
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
        if(selectedEmpInfo.apvchoice==''){
            alert("결재자는 필수입니다.");
        }else{
            setIsModalComplete(true); 
        }
        
    }


    useEffect(() => {
        if (isModalComplete) {
            //structuredClone이유: 이걸 하지 않으면 메인에서 모달창을 띄울때와 writeForm에서 모달창을 띄울때 구분할 수 없게된다.
            //예를 들어. selectedDocCode를 writeform에서도 사용될 경우
            //양식이 변경될때마다 제목과 밑에 컴포넌트, 결재라인까지 함께 변경되어 버려서 새 결재 진행같은 느낌이 들지 않음
            setCloneDocCode(structuredClone(selectedDocCode));
            setCloneEmpInfo(structuredClone(selectedEmpInfo));
            closeModal();
            navi(`/approval/document/new?type=${selectedDocCode.children.name}`); // 페이지 다시 로드
        }
    }, [isModalComplete]);



    return (
        <div className={styles.sideBox}>
            <div className={styles.textBox} onClick={() => navi('/approval')}>전자결재</div>
            <div className={styles.btnBox}>
                <button className={styles.addBtn} onClick={handleModalChange} name="ModalForm">새 결재 진행하기</button>
            </div>
            <div className={styles.proceedingBox}>
                <div className={styles.boxtext}>진행중 문서</div>
                <div className={styles.menuBox}>
                    {
                        ['기안진행','결재대기','결재예정','참조/열람대기'].map((item,index) => {
                            return(
                                <div className={styles.menu}  onClick={() => navi(`/approval/list?type=${item}`)}>
                                    <span className={styles.menutext}>{item}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={styles.docBox}>
                <div className={styles.boxtext}>문서함</div>
                <div className={styles.menuBox}>
                    {
                        ['기안문서함','임시문서함','결재문서함','참조/열람문서함'].map((item,index)=>{
                            return(
                                <div className={styles.menu}  onClick={() => navi(`/approval/list?type=${item}`)}>
                                    <span className={styles.menutext}>{item}</span>
                                </div>
                            )
                        })
                    }
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
                                    <button name="next" onClick={handleFormNext} className={styles.btn} > 다음</button>
                                </div>
                                </>
                            )}
                            {Page === 2 && (
                                <>
                                <ChoiceLine Page={Page}/>
                                <div className={styles.modalbtnBox}>
                                    <button name="prev" onClick={handlePageChange} className={styles.btn}> 이전</button>
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
