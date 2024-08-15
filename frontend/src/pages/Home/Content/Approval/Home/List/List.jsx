import { useEffect, useState} from 'react';
import styles from './List.module.css';
import { BaseUrl } from '../../../../../../commons/config';
import axios from "axios";
import { useMemberStore } from '../../../../../../store/store';
import { set } from 'date-fns';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos  } from "react-icons/md";

export const List=({type, cpage})=>{
    //type==기안진행,...사이드바 메뉴들...
    /************페이지네이션**************/
    //1. 전체 글의 갯수
    const [recordTotalCount, setRecordTotalCount] = useState();

    //2. 한 페이지에 몇개의 게시글 보여 줄건지
    const recordCountPerPage=10;

    //3.Page Navigater 페이지 번호 자체를 몇 개씩 보여줄건지 결정
	const naviCountPerPage=5;

    //4. 총 몇 페이지가 필요한가 네비게이터의 숫자 1번/2번 
    const [pageTotalCount, setPageTotalCount] = useState();

	useEffect(()=>{
        if(recordTotalCount%recordCountPerPage>0) {
            // 나머지가 발생하는 경우
            setPageTotalCount(recordTotalCount/recordCountPerPage+1);
        }else {
            // 나머지가 0인 경우
            setPageTotalCount(recordTotalCount/recordCountPerPage);
        }

    },[recordTotalCount, recordCountPerPage])	


    // 현재 페이지 번호
    const [currentPage, setCurrentPage] = useState(cpage); 

    //navi의 시작점
    const [startNavi, setStartNavi]=useState();
    const [endNavi, setEndNavi]=useState();

    //화살표 붙이기
    const [needPrev, setNeedPrev]=useState(true);
    const [needNext, setNeedNext]=useState(true);

    //알고리즘 . currentPage를 기준으로 navi범위구하기
    useEffect(()=>{
            // startNavi를 먼저 계산하고 그 다음 endNavi를 계산합니다.
            const start = Math.floor((currentPage - 1) / naviCountPerPage) * naviCountPerPage + 1;
            const end = Math.min(start + naviCountPerPage - 1, pageTotalCount);
            
            setStartNavi(start); // startNavi 설정
            setEndNavi(end); // endNavi 설정

    },[currentPage, naviCountPerPage, pageTotalCount, recordTotalCount])

    //화살표 필요없는 경우 설정
   // 화살표 필요없는 경우 false로 설정하는 useEffect
    useEffect(() => {
        if (startNavi === 1) {
            setNeedPrev(false);
        } else {
            setNeedPrev(true);
        }

        if (endNavi === pageTotalCount) {
            setNeedNext(false);
        } else {
            setNeedNext(true);
        }
    }, [startNavi, endNavi, pageTotalCount]);

    useEffect(() => {
        setCurrentPage(1); // 데이터가 새로 로드되면 페이지를 처음으로 초기화
    }, [type]);


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
        if(type==='기안진행' || type==='결재대기' ||type==='결재예정' ||type==='참조/열람대기' ){
            axios.get(`${BaseUrl()}/approval/list`, list).then((resp)=>{
                setDocumentDTOs(resp.data.document)
                setApvLineDTOs(resp.data.apvline)
                setParticipantsLineDTOs(resp.data.pline)
            }).finally(() => {
                setLoading(false);
            });
        }
    },[type, list])

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
            ).map(doc => {
                const participant = filteredPartLine.find(part => part.docSeq === doc.docSeq);
                return {
                    ...doc,
                    participantType: participant.pcpDivision === 'r' ? '참조' : '열람'
                };
            });
            
        }
        // else if(type==='기안문서함'){
        //     //백엔드 페이지네이션 필요
        //     //기안자가 나이고, 문서상태가 반려 또는 완료일 일 때
        //     // filteredDocument = list.document.filter(line =>
        //     //     (line.drafterSeq === sessionData.empSeq) && (line.stateName === '반려' || line.stateName === '완료')
        //     // );
        //     axios.get(`${BaseUrl()}/approval/list/finish`, list).then((resp)=>{

        //     })   
        // }
        // else if(type==='임시문서함'){
        //      //기안자가 나이고, 문서상태가 임시저장일 때
        //      filteredDocument = list.document.filter(line =>
        //         (line.drafterSeq === sessionData.empSeq) && (line.stateName === '임시저장')
        //     );
            
        // }else if(type==='결재문서함'){
        //     //백엔드 페이지 네이션 필요
        //     //내가 결재라인에 포함되어 있고, 결재상태가 완료(3) 또는 반려(4) 또는 중지(9)일때의 문서들
        //     // filteredApvline = list.apvline.filter(line =>
        //     //     line.apverId === sessionData.empSeq && (line.apvStatusCode === 3 || line.apvStatusCode === 4 || line.apvStatusCode===9)
        //     // );
        //     // filteredDocument = list.document.filter(doc => 
        //     //    filteredApvline.some(apv => apv.docSeq === doc.docSeq)
        //     // );

           
        // }else if(type==='참조/열람문서함'){
        //     //백엔드 페이지 네이션 필요
        //     //    filteredPartLine = list.participantsLineDTOs.filter(line =>
        //     //     line.empSeq === sessionData.empSeq && line.readYN === "y"
        //     // );
        //     // filteredDocument = list.document.filter(doc => 
        //     //     filteredPartLine.some(part => part.docSeq === doc.docSeq)
        //     // );
            // 
        //  }
         else{
            console.log('잘못된 접근');
        }
        setFilteredDocuments(filteredDocument);
        setFilteredApvLines(filteredApvline);
        setFilteredPartLines(filteredPartLine);

        // 필터링된 데이터의 총 개수를 업데이트합니다.
        setRecordTotalCount(filteredDocument.length);

    }, [list, type, currentPage])

    //필터링된 데이터 슬라이싱 배열
    const [paginatedDocuments, setPaginatedDocuments]=useState();
    useEffect(()=>{
        setPaginatedDocuments(filteredDocuments.slice(
            (currentPage - 1) * recordCountPerPage,
            currentPage * recordCountPerPage)
        )
    },[currentPage, recordCountPerPage, filteredDocuments])


    //기안문서함 (백엔드페이지네이션)
    // useEffect(() => {
    //     if (type === '기안문서함') {
    //         axios.get(`${BaseUrl()}/approval/list/finish`, {
    //             params: {
    //                 page: currentPage,  // 페이지 번호 전달
    //                 size: pageSize      // 페이지당 항목 수 전달
    //             }
    //         }).then((resp) => {
    //             setDocumentDTOs(resp.data.documents);
    //             setTotalCount(resp.data.totalCount);  // 총 문서 수 설정
    //             setApvLineDTOs(resp.data.apvline);
    //             setParticipantsLineDTOs(resp.data.pline);
    //         }).finally(() => {
    //             setLoading(false);
    //         });
    //     }
    // }, [type, currentPage, pageSize]);

    // 페이지를 클릭할 때, URL을 업데이트하는 로직
      const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
        navi(`?type=${type}&cpage=${pageNum}`);  // 페이지 클릭 시 URL 업데이트
    };

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
                        <>
                        <table>
                            <thead>
                                <tr>
                                {(type === '참조/열람대기' || type==='참조/열람문서함') && (
                                        <td className={`${styles.td10} ${styles.theadtd}`}>
                                            구분
                                        </td>
                                    )}
                                    {['기안일', '완료일', '결재양식', '긴급', '제목', '기안자', '현재결재자', '최종결재자', '문서상태'].map((item, index) => (
                                        <td key={index} className={`${styles['td' + (index + 1)]} ${styles['theadtd' + (index + 1)]} ${styles.theadtd}`}>{item}</td>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedDocuments.length > 0 ? (
                                    paginatedDocuments.map((line, index) => (
                                        <tr key={index}>
                                            {(type === '참조/열람대기' || type==='참조/열람문서함')&& (
                                                <td className={`${styles.td10} ${styles.tablerow}`}>
                                                    {line.participantType}
                                                </td>
                                            )}
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

                        {/* 페이지네이션 추가 */}
                        <div className={styles.paginationBox}>
                            <div className={styles.pagination}>
                                {needPrev && <span onClick={() => handlePageClick(startNavi - 1)} className={styles.naviarrow}>  <MdOutlineArrowBackIos size={18} /></span>}
                                {
                                    // for 문을 사용하여 페이지 번호를 출력
                                    (() => {
                                        const pageButtons = [];
                                        for (let i = startNavi; i <= endNavi; i++) {
                                            pageButtons.push(
                                                <span key={i} onClick={() => handlePageClick(i)} className={styles.navinum}>{i}</span>
                                            );
                                        }
                                        return pageButtons;
                                    })()
                                }
                                {needNext && <span onClick={() => handlePageClick(endNavi + 1)} className={styles.naviarrow}> <MdOutlineArrowForwardIos size={18} /></span>}
                            </div>
                        </div>

                        </>
       
                    )}
                </div>
            </div>
        </div>
    )
}


