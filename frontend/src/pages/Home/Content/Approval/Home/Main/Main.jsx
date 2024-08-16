import styles from './Main.module.css'
import axios from "axios"
import { useEffect, useState} from 'react'
import { Card } from './Card/Card'
import { useMemberStore } from '../../../../../../store/store'
import { BaseUrl } from '../../../../../../commons/config'
import { format } from 'date-fns';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos  } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


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
    const [documentDTOs, setDocumentDTOs] = useState([{
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

    //랩
    const [list, setList]=useState({});

    //전체 정보 한번만 가져오기
    useEffect(()=>{
        axios.get(`${BaseUrl()}/approval/list/main`, list).then((resp)=>{
            console.log(resp.data)
            setDocumentDTOs(resp.data)
        })
    },[])

    useEffect(()=>{
        setList({
            "document": documentDTOs
        })
        // console.log(documentDTOs)
        // console.log(apvLineDTOs)
        // console.log(participantsLineDTOs)
        // console.log(list);
    },[documentDTOs])

    // 필터링된 리스트 상태
    const [filteredMainCard, setFilteredMainCard] = useState([]);
    const [filteredMainList, setFilteredMainList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    useEffect(()=>{
        if (!Array.isArray(list.document)) return; // 리스트가 배열이 아닐 때는 아무것도 하지 않음
        //변해야 하는 값
        let filteredMainCard = [];
        let filteredMainList = [];

        //카드 == 현재결재자가 나인 문서들 넘겨야 할 정보들 (문서상태, 제목, 기안자, 기안일)
        filteredMainCard=list.document.filter(line=>
            line.currentApverSeq ===sessionData.empSeq && line.stateName === '진행중' && (line.apvState === '대기' || line.apvState==="보류")
        )

        //리스트 == 내가 기안자이고 문서상태가 진행중인 문서들
        filteredMainList=list.document.filter(line=>
            line.drafterSeq ===sessionData.empSeq && line.stateName === '진행중'
        ).slice(0,5);//상위5개항목추출

        setFilteredMainCard(filteredMainCard)
        setFilteredMainList(filteredMainList)
    },[list])

      // 페이지 전환 핸들러
      const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredMainCard.length / 5) - 1));
    };

     // 현재 페이지에 해당하는 카드들
     const displayedCards = filteredMainCard.slice(currentPage * 5, (currentPage * 5) + 5);


        // 상태가 업데이트된 후 값을 확인하기 위한 useEffect 추가
        useEffect(() => {
            console.log("Filtered Main Card:", filteredMainCard);
            console.log("Filtered Main List:", filteredMainList);
        }, [filteredMainCard, filteredMainList]);

    
    const handleDetail=(seq, type)=>{
        navi(`/approval/document/${seq}?type=${type}`)
    }
    return(
        <div className={styles.container}>
            <div className={styles.header}><h3>전자결재</h3></div>
            <div className={styles.cardWrapper}>
                <div className={styles.cardBox}>
                    {displayedCards.map((line, index) => (
                            <Card key={index} apvState={line.apvState} title={line.title} drafterName={line.drafterName} writeDate={line.writeDate} 
                            egcYn={line.egcYn} seq={line.docSeq} detailName={line.detailName} />
                        ))}
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
                            disabled={currentPage === Math.ceil(filteredMainCard.length / 5) - 1}
                        >
                            <MdOutlineArrowForwardIos size={20}/>
                        </span>
                    </div>
                    </div>
                </div>
            </div>
            <div className={styles.ingBox}>
                <div className={styles.listheader}><h4 className={styles.headerText}>기안 진행 문서</h4></div>
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
                            {
                                       (filteredMainList || []).map((line, index) => (
                                        <tr key={index} className={styles.tbodytr}>
                                            <td className={`${styles.td1} ${styles.tablerow}`}>{formatDate(line.writeDate)}</td>
                                            <td className={`${styles.td2} ${styles.tablerow}`}>{line.detailName}</td>
                                            <td className={`${styles.td3} ${styles.tablerow}`}>
                                                {line.egcYn === 'n' ? '' : <div className={styles.stateBox}>
                                                            <span className={styles.egcstate}>긴급</span></div>
                                                        }
                                            </td>
                                            <td className={`${styles.td4} ${styles.tablerow}`}  onClick={() => handleDetail(line.docSeq, line.detailName)}>{line.title}</td>
                                            <td className={`${styles.td5} ${styles.tablerow}`}>{line.drafterName}</td>
                                            <td className={`${styles.td6} ${styles.tablerow}`}>{line.currentApverName}</td>
                                            <td className={`${styles.td7} ${styles.tablerow}`}>
                                                {line.stateName === '진행중' ? <div className={styles.stateBox}>
                                                            <span className={styles.stateName}>{line.stateName}</span></div>
                                                            : ''}
                                            </td>
                                        </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>                
            </div>
        </div>
    )
}

