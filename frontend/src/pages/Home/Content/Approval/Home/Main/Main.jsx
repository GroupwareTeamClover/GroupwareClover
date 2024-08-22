import styles from './Main.module.css'
import axios from "axios"
import { useEffect, useState} from 'react'
import { Card } from './Card/Card'
import { useMemberStore } from '../../../../../../store/store'
import { BaseUrl } from '../../../../../../commons/config'
import { format } from 'date-fns';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos  } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../../../../../components/Loading/Loading'

export const Main=()=>{
    
     //세션정보
     const {sessionData} = useMemberStore();

     const navi = useNavigate();

    // 날짜 변환 함수
    const formatDate = (date) => {
        if (!date) return '-';
        return format(new Date(date), 'yyyy-MM-dd');
    };
    

    // DocumentDTO 구성
    const [listDocumentDTOs, setListDocumentDTOs]=useState([{
        docSeq: 0,
        docDetailCode: 0, // 예시 값
        docStateCode: 0, // 진행중의미
        drafterSeq: 0, // 기안자seq
        egcYn: 'n', //긴급여부
        writeDate: null,
        finishDate: null,
        currentApverSeq: 0, // 현재결재자
        finalApverSeq: 0, // 최종결재자
        docComSeq: null,
        title: '',
        drafterName:'',
        currentApverName:'',
        finalApverName:'',
        detailName:'',
        stateName:'',
        apvState:''
    }]);
    const [cardDocumentDTOs, setCardDocumentDTOs] = useState([{
        docSeq: 0,
        docDetailCode: 0, // 예시 값
        docStateCode: 0, // 진행중의미
        drafterSeq: 0, // 기안자seq
        egcYn: 'n', //긴급여부
        writeDate: null,
        finishDate: null,
        currentApverSeq: 0, // 현재결재자
        finalApverSeq: 0, // 최종결재자
        docComSeq: null,
        title: '',
        drafterName:'',
        currentApverName:'',
        finalApverName:'',
        detailName:'',
        stateName:'',
        apvState:''
    }]);


    //전체 정보 한번만 가져오기
    useEffect(()=>{

        //카드 정보
        axios.get(`${BaseUrl()}/approval/list/main/card`).then((resp)=>{
            console.log(resp.data)
            setCardDocumentDTOs(resp.data)
        })

        //리스트 정보
         axios.get(`${BaseUrl()}/approval/list/main/list`).then((resp)=>{
            console.log(resp.data)
            setListDocumentDTOs(resp.data)
        })
    },[])

    const [currentPage, setCurrentPage] = useState(0);


    // 페이지 전환 핸들러
    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(cardDocumentDTOs.length / 5) - 1));
    };

     // 현재 페이지에 해당하는 카드들
     const displayedCards = cardDocumentDTOs.length> 0? cardDocumentDTOs.slice(currentPage * 5, (currentPage * 5) + 5):[];


    // 상태가 업데이트된 후 값을 확인하기 위한 useEffect 추가
    useEffect(() => {
        console.log("Filtered Main Card:", cardDocumentDTOs);
        console.log("Filtered Main List:", listDocumentDTOs);
        console.log("Filtered Main displayedCards:", displayedCards);
    }, [cardDocumentDTOs, listDocumentDTOs, displayedCards]);

    
    const handleDetail=(seq, type)=>{
        navi(`/approval/document/${seq}?type=${type}`)
    }
    return(
        <div className={styles.container}>
            <div className={styles.header}><h3>전자결재</h3></div>
            <div className={styles.cardWrapper}>
                <div className={styles.cardBox}>
                {displayedCards.length > 0 ? (
                        displayedCards.map((line, index) => (
                            <Card key={index} apvState={line.apvState} title={line.title} drafterName={line.drafterName} writeDate={line.writeDate}
                                egcYn={line.egcYn} seq={line.docSeq} detailName={line.detailName} />
                        ))
                    ) : (
                        <div className={styles.noData}>결재할 문서가 없습니다.</div>
                    )}
                </div>
                <div className={styles.cardLine}>
                    <div className={styles.pagination}>
                    <div className={styles.pagination}>
                        <span 
                            className={styles.paginationSpan}
                            onClick={handlePrevPage} 
                            disabled={currentPage === 0}
                        >
                            <MdOutlineArrowBackIos size={20}/>
                        </span>
                        <span 
                            className={styles.paginationSpan}
                            onClick={handleNextPage} 
                            disabled={currentPage === Math.ceil(cardDocumentDTOs.length / 5) - 1}
                        >
                            <MdOutlineArrowForwardIos size={20}/>
                        </span>
                    </div>
                    </div>
                </div>
            </div>
            <div className={styles.ingBox}>
                <div className={styles.listheader}><h3 className={styles.headerText}>기안 진행 문서</h3></div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                {['기안일', '결재양식', '긴급', '제목', '기안자', '현재결재자', '문서상태'].map((item, index) => (
                                    <td key={index} className={` ${styles['theadtd' + (index + 1)]} ${styles.theadtd}`}>{item}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                        {listDocumentDTOs.length > 0 ? (
                                listDocumentDTOs.map((line, index) => (
                                    <tr key={index} className={styles.tbodytr}>
                                        <td className={`${styles.td1} ${styles.tablerow}`}>{formatDate(line.writeDate)}</td>
                                        <td className={`${styles.td2} ${styles.tablerow}`}>{line.detailName}</td>
                                        <td className={`${styles.td3} ${styles.tablerow}`}>
                                            {line.egcYn === 'n' ? '' : <div className={styles.stateBox}>
                                                <span className={styles.egcstate}>긴급</span></div>
                                            }
                                        </td>
                                        <td className={`${styles.td4} ${styles.tablerow}`} onClick={() => handleDetail(line.docSeq, line.detailName)}>{line.title}</td>
                                        <td className={`${styles.td5} ${styles.tablerow}`}>{line.drafterName}</td>
                                        <td className={`${styles.td6} ${styles.tablerow}`}>{line.currentApverName}</td>
                                        <td className={`${styles.td7} ${styles.tablerow}`}>
                                            {line.stateName === '진행중' ? <div className={styles.stateBox}>
                                                <span className={styles.stateName}>{line.stateName}</span></div>
                                                : ''}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className={styles.noData}>진행 중인 문서가 없습니다.</td>
                                </tr>
                            )}
                        
                        </tbody>
                    </table>
                </div>                
            </div>
        </div>
    )
}

