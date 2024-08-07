import { useEffect, useState} from 'react';
import styles from './List.module.css';
import { BaseUrl } from '../../../../../../commons/config';
import axios from "axios";
import { useMemberStore } from '../../../../../../store/store';
import { set } from 'date-fns';

export const List=({type})=>{
    //type==기안진행,...사이드바 메뉴들...
    /************전체데이터준비**************/
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
        title: ''
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
        })
        // console.log(documentDTOs)
        // console.log(apvLineDTOs)
        // console.log(participantsLineDTOs)
        // console.log(list);
    },[documentDTOs])

    //전체 정보 한번만 가져오기
    useEffect(()=>{
        axios.get(`${BaseUrl()}/approval/list`, list).then((resp)=>{
            setDocumentDTOs(resp.data.document)
            setList({
                "apvline" : resp.data.apvline,
                "pline" : resp.data.pline
            })
        })
    },[])

    //customList
    // const [customList, setCustomList]=useState({});
    // 로그인 정보 : console.log(sessionData.empSeq);
    useEffect(()=>{
        
        let filteredList = [];
        if(type==='기안진행'){
            // (list.document || []).forEach((line) => {
            //     if (line.drafterSeq === sessionData.empSeq && line.docStateCode) {
            //         console.log('true');
            //     } else {
            //         console.log('false');
            //     }
            // });
            // setDocumentDTOs(
            //     (list.document || []).map((line)=>
            //         line.drafterSeq===sessionData.empSeq && line.docStateCode ?
            //         line : {...line}
            //     )
            // );
            filteredList = (list.document || []).filter(line =>
                line.drafterSeq === sessionData.empSeq && line.docStateCode
            );

        }else if(type==='결재대기'){
    
        }else if(type==='결재예정'){
            
        }else if(type==='참조/열람대기'){
            
        }else if(type==='기안문서함'){
            
        }else if(type==='임시문서함'){
            
        }else if(type==='결재문서함'){
            
        }else if(type==='참조/열람문서함'){
            
        }else{
            // console.log('잘못된 접근');
        }
        setList(prevState => ({ ...prevState, document: filteredList }));

    }, [type, sessionData.empSeq])
    
    console.log(list);


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
                <table>
                    <thead>
                        <tr>
                        { ['기안일','완료일','결재양식','긴급','제목','기안자','현재결재자','최종결재자','문서상태'].map((item,index)=>{
                                return(
                                    <th>{item}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (list.document || []).map((line)=>{
                                return(
                                    <tr>
                                        <td>{line.writeDate}</td>
                                        <td>{line.finishDate}</td>
                                        <td>{line.docDetailCode}</td>
                                        <td>{line.egcYn}</td>
                                        <td>{line.title}</td>
                                        <td>{line.drafterSeq}</td>
                                        <td>{line.currentApverSeq}</td>
                                        <td>{line.finishApverSeq}</td>
                                        <td>{line.docStateCode}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}



        //  const [refParticipants, setRefParticipants]  = useState({
        //     lineSeq: 0,
        //     empSeq: 0,
        //     pcpDivision: '',
        //     readYN: '',
        //     readDate: null,
        //     docSeq: 0
        // });


        // const [vieParticipants, setVieParticipants] =useState({
        //     lineSeq: 0,
        //     empSeq: 0,
        //     pcpDivision: '',
        //     readYN: '',
        //     readDate: null,
        //     docSeq: 0
        // })