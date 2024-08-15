import { useEffect, useState} from 'react';
import styles from './List.module.css';
import { BaseUrl } from '../../../../../../commons/config';
import axios from "axios";
import { useMemberStore } from '../../../../../../store/store';
import { set } from 'date-fns';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const List=({type})=>{
    //type==기안진행,...사이드바 메뉴들...
    /************페이지네이션**************/




    /************전체데이터준비**************/
    // const[typeCheck, setTypeCheck]=useState(type);

    // 로딩 상태 관리
    const [loading, setLoading] = useState(true);
    const navi = useNavigate();

     //세션정보
     const {sessionData} = useMemberStore();
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
        stateName:''
    }]);
    // ApvLineDTO
    const [apvLineDTOs, setApvLineDTOs] = useState([]);
    // ParticipantsLineDTO 구성
    const [participantsLineDTOs, setParticipantsLineDTOs] = useState([]);
    //랩
    const [list, setList]=useState({});

    useEffect(()=>{
        setList({
            "document": documentDTOs,
            "apvline": apvLineDTOs,
            "participantsLineDTOs": participantsLineDTOs
        })
        // console.log(documentDTOs)
        // console.log(apvLineDTOs)
        // console.log(participantsLineDTOs)
        // console.log(list);
    },[documentDTOs, apvLineDTOs, participantsLineDTOs])

    //전체 정보 한번만 가져오기
    useEffect(()=>{
        axios.get(`${BaseUrl()}/approval/list`, list).then((resp)=>{
            setDocumentDTOs(resp.data.document)
            setApvLineDTOs(resp.data.apvline)
            setParticipantsLineDTOs(resp.data.pline)
        }).finally(() => {
            setLoading(false);
        });
    },[type])

    //customList
    // const [customList, setCustomList]=useState({});
    // 로그인 정보 : console.log(sessionData.empSeq);

    // 필터링된 리스트 상태
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [filteredApvLines, setFilteredApvLines] = useState([]);
    const [filteredPartLines, setFilteredPartLines] = useState([]);


    useEffect(()=>{
        if (!Array.isArray(list.document)) return; // 리스트가 배열이 아닐 때는 아무것도 하지 않음
        //변해야 하는 값
        let filteredDocument = [];
        let filteredApvline = [];
        let filteredPartLine = [];
        let cpage=1;
        let recordTotalCount;
        let recordCountPerPage;
        let naviCountPerPage;

        if(type==='기안진행'){
            //기안자가 나이고, 문서상태가 진행중일 때 
            filteredDocument = list.document.filter(line =>
                line.drafterSeq === sessionData.empSeq && line.stateName === '진행중'
            );
        }else if(type==='결재대기'){
            //내가 결재라인에 포함되어 있고, 결재상태가 대기==1 또는 보류==8일때의 문서들
            //문서상태가 진행중일때 (임시저장 제외하기 위함)
            filteredApvline = list.apvline.filter(line =>
                line.apverId === sessionData.empSeq && (line.apvStatusCode === 1 || line.apvStatusCode === 8)
            );
            filteredDocument = list.document.filter(doc => 
               filteredApvline.some(apv => apv.docSeq === doc.docSeq) && doc.stateName === '진행중'
            );
    
        }else if(type==='결재예정'){
            //내가 결재라인에 포함되어 있고, 결재상태가 예정==2일때의 문서들
            //문서상태가 진행중일 때
            filteredApvline = list.apvline.filter(line =>
                line.apverId === sessionData.empSeq && line.apvStatusCode === 2
            );
            filteredDocument = list.document.filter(doc => 
               filteredApvline.some(apv => apv.docSeq === doc.docSeq) && doc.stateName === '진행중'
            );
            
        }else if(type==='참조/열람대기'){
            //참조자: 모든 상태의 문서를 확인할 수 있으나, 아직 읽지 않은 문서들만 포함
            //열람자: 완료 또는 반려된 문서를 확인할 수 있으나, 아직 읽지 않은 문서들만 포함
          
             filteredPartLine = list.participantsLineDTOs.filter(line =>
                line.empSeq === sessionData.empSeq && line.readYN === "n"
            );
            filteredDocument = list.document.filter(doc => 
                filteredPartLine.some(part => 
                    part.docSeq === doc.docSeq && (
                        (part.pcpDivision === 'r') || 
                        (part.pcpDivision === 'v' && (doc.stateName === '완료' || doc.stateName === '반려'))
                    )
                )
            );
            
        }else if(type==='기안문서함'){
            //백엔드 페이지네이션 필요
            //기안자가 나이고, 문서상태가 반려 또는 완료일 일 때
            filteredDocument = list.document.filter(line =>
                (line.drafterSeq === sessionData.empSeq) && (line.stateName === '반려' || line.stateName === '완료')
            );
            
        }else if(type==='임시문서함'){
             //기안자가 나이고, 문서상태가 임시저장일 때
             filteredDocument = list.document.filter(line =>
                (line.drafterSeq === sessionData.empSeq) && (line.stateName === '임시저장')
            );
            
        }else if(type==='결재문서함'){
            //백엔드 페이지 네이션 필요
                //내가 결재라인에 포함되어 있고, 결재상태가 완료(3) 또는 반려(4) 또는 중지(9)일때의 문서들
                filteredApvline = list.apvline.filter(line =>
                    line.apverId === sessionData.empSeq && (line.apvStatusCode === 3 || line.apvStatusCode === 4 || line.apvStatusCode===9)
                );
                filteredDocument = list.document.filter(doc => 
                   filteredApvline.some(apv => apv.docSeq === doc.docSeq)
                );

           
        }else if(type==='참조/열람문서함'){
               //백엔드 페이지 네이션 필요
               filteredPartLine = list.participantsLineDTOs.filter(line =>
                line.empSeq === sessionData.empSeq && line.readYN === "y"
            );
            filteredDocument = list.document.filter(doc => 
                filteredPartLine.some(part => part.docSeq === doc.docSeq)
            );
            
        }else{
            // console.log('잘못된 접근');
        }
        setFilteredDocuments(filteredDocument);
        setFilteredApvLines(filteredApvline);
        setFilteredPartLines(filteredPartLine);

    }, [list])

  
    
    // console.log(list);

    const handleDetail=(seq, type)=>{
        navi(`/approval/document/${seq}?type=${type}`)
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>{type}</h3>
            </div>
            <div className={styles.menu}>
                {type==='기안진행' ? <></>:<></>}
                {type==='결재대기' ? <></>:<></>}
                {type==='참조/열람대기' ? <></>:<></>}
                {type==='기안문서함' ? <></>:<></>}
                {type==='임시문서함' ? <></>:<></>}
                {type==='결재문서함' ? <></>:<></>}
                {type==='참조/열람문서함' ? <></>:<></>}
            </div>
            <div className={styles.content}>
            <div className={styles.contentbox}>
                    {loading ? (
                        <p>로딩 중...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    {['기안일', '완료일', '결재양식', '긴급', '제목', '기안자', '현재결재자', '최종결재자', '문서상태'].map((item, index) => (
                                        <td key={index} className={`${styles['td' + (index + 1)]} ${styles['theadtd' + (index + 1)]} ${styles.theadtd}`}>{item}</td>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocuments.length > 0 ? (
                                    filteredDocuments.map((line, index) => (
                                        <tr key={index}>
                                            <td className={`${styles.td1} ${styles.tablerow}`}>{formatDate(line.writeDate)}</td>
                                            <td className={`${styles.td2} ${styles.tablerow}`}>{formatDate(line.finishDate)}</td>
                                            <td className={`${styles.td3} ${styles.tablerow}`}>{line.detailName}</td>
                                            <td className={`${styles.td4} ${styles.tablerow}`}>
                                                {line.egcYn === 'n' ? '' : <div className={styles.stateBox}>
                                                    <span className={styles.egcstate}>긴급</span></div> 
                                               }
                                            </td>
                                            <td className={`${styles.td5} ${styles.tablerow} ${styles.title}`}  onClick={() => handleDetail(line.docSeq, line.detailName)}>{line.title}</td>
                                            <td className={`${styles.td6} ${styles.tablerow}`}>{line.drafterName}</td>
                                            <td className={`${styles.td7} ${styles.tablerow}`}>{line.currentApverName}</td>
                                            <td className={`${styles.td8} ${styles.tablerow}`}>{line.finalApverName}</td>
                                            <td className={`${styles.td9} ${styles.tablerow}`}>
                                                {line.stateName === '진행중' ?  <div className={styles.stateBox}>
                                                    <span className={styles.ingstate}>{line.stateName}</span></div> 
                                                : ''}
                                                 {line.stateName === '반려' ?  <div className={styles.stateBox}>
                                                    <span className={styles.rejectstate}>{line.stateName}</span></div> 
                                                : ''}
                                                 {line.stateName === '완료' ?  <div className={styles.stateBox}>
                                                    <span className={styles.comstate}>{line.stateName}</span></div> 
                                                : ''}
                                                {line.stateName === '임시저장' ?  <div className={styles.stateBox}>
                                                    <span className={styles.tempstate}>{line.stateName}</span></div> 
                                                : ''}

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className={styles.noData}>내용이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}


