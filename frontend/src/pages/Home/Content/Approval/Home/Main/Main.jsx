import styles from './Main.module.css'
import axios from "axios"
import { useEffect, useState} from 'react'
import { Card } from './Card/Card'
import { useMemberStore } from '../../../../../../store/store'
import { BaseUrl } from '../../../../../../commons/config'


export const Main=()=>{
    
     //세션정보
     const {sessionData} = useMemberStore();

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

    //랩
    const [list, setList]=useState({});

    //전체 정보 한번만 가져오기
    useEffect(()=>{
        axios.get(`${BaseUrl()}/approval/list/main`, list).then((resp)=>{
            setDocumentDTOs(resp.data.document)
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


    //받아온 데이터에서 카드list와 밑에 list구분하기
    
    //카드 == 현재결재자가 나인 문서들 
    //카드에 넘겨야 할 정보들 (문서상태, 제목, 기안자, 기안일)

    //리스트 == 내가 기안자이고 문서상태가 진행중인 문서들
    useEffect(()=>{

    },[list])




    return(
        <div className={styles.container}>
            <div className={styles.header}><h3>전자결재</h3></div>
            <div className={styles.cardWrapper}>
                <div className={styles.cardBox}>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                </div>
                <div className={styles.cardLine}></div>
            </div>
            <div className={styles.ingBox}>
                <div className={styles.listheader}><h4 className={styles.headerText}>기안 진행 문서</h4></div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <td className={styles.theadtd}>기안일</td>
                                <td className={styles.theadtd}>결재양식</td>
                                <td className={styles.theadtd}>긴급</td>
                                <td className={styles.theadtd}>제목</td>
                                <td className={styles.theadtd}>첨부</td>
                                <td className={styles.theadtd}>결재상태</td>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {/* 데이터영역 */}
                        </tbody>
                    </table>
                </div>                
            </div>
        </div>
    )
}