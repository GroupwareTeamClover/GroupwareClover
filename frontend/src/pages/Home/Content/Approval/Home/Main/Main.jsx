import styles from './Main.module.css'
import axios from "axios"
import { useEffect, useState } from 'react'
import { Card } from './Card/Card'
import { useMemberStore } from '../../../../../../store/store'
import { BaseUrl } from '../../../../../../commons/config'
import { format } from 'date-fns';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../../../../../components/Loading/Loading'

export const Main = () => {

    const { sessionData } = useMemberStore();
    const navi = useNavigate();

    const formatDate = (date) => {
        if (!date) return '-';
        return format(new Date(date), 'yyyy-MM-dd');
    };

    const [listDocumentDTOs, setListDocumentDTOs] = useState([{
        docSeq: 0,
        docDetailCode: 0,
        docStateCode: 0,
        drafterSeq: 0,
        egcYn: 'n',
        writeDate: null,
        finishDate: null,
        currentApverSeq: 0,
        finalApverSeq: 0,
        docComSeq: null,
        title: '',
        drafterName: '',
        currentApverName: '',
        finalApverName: '',
        detailName: '',
        stateName: '',
        apvState: ''
    }]);

    const [cardDocumentDTOs, setCardDocumentDTOs] = useState([{
        docSeq: 0,
        docDetailCode: 0,
        docStateCode: 0,
        drafterSeq: 0,
        egcYn: 'n',
        writeDate: null,
        finishDate: null,
        currentApverSeq: 0,
        finalApverSeq: 0,
        docComSeq: null,
        title: '',
        drafterName: '',
        currentApverName: '',
        finalApverName: '',
        detailName: '',
        stateName: '',
        apvState: ''
    }]);

    const [isCardLoading, setIsCardLoading] = useState(true); // 카드 데이터 로딩 상태
    const [isListLoading, setIsListLoading] = useState(true); // 리스트 데이터 로딩 상태
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        setIsCardLoading(true); // 카드 로딩 시작
        axios.get(`${BaseUrl()}/api/approval/list/main/card`).then((resp) => {
            setCardDocumentDTOs(resp.data);
            setIsCardLoading(false); // 카드 로딩 완료
        });

        setIsListLoading(true); // 리스트 로딩 시작
        axios.get(`${BaseUrl()}/api/approval/list/main/list`).then((resp) => {
            setListDocumentDTOs(resp.data);
            setIsListLoading(false); // 리스트 로딩 완료
        });
    }, []);

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(cardDocumentDTOs.length / 5) - 1));
    };

    const displayedCards = cardDocumentDTOs.length > 0 ? cardDocumentDTOs.slice(currentPage * 5, (currentPage * 5) + 5) : [];

    const handleDetail = (seq, type) => {
        navi(`/approval/document/${seq}?type=${type}`)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}><h3>전자결재</h3></div>
            <div className={styles.cardWrapper}>
                <div className={styles.cardBox}>
                    {isCardLoading ? (
                        <Loading /> // 카드 데이터를 불러오는 동안 로딩 컴포넌트 표시
                    ) : (
                        displayedCards.length > 0 ? (
                            displayedCards.map((line, index) => (
                                <Card key={index} apvState={line.apvState} title={line.title} drafterName={line.drafterName} writeDate={line.writeDate}
                                    egcYn={line.egcYn} seq={line.docSeq} detailName={line.detailName} />
                            ))
                        ) : (
                            <div className={styles.noData}>결재할 문서가 없습니다.</div>
                        )
                    )}
                </div>
                <div className={styles.cardLine}>
                    <div className={styles.pagination}>
                        <span
                            className={styles.paginationSpan}
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                        >
                            <MdOutlineArrowBackIos size={20} />
                        </span>
                        <span
                            className={styles.paginationSpan}
                            onClick={handleNextPage}
                            disabled={currentPage === Math.ceil(cardDocumentDTOs.length / 5) - 1}
                        >
                            <MdOutlineArrowForwardIos size={20} />
                        </span>
                    </div>
                </div>
            </div>
            <div className={styles.ingBox}>
                <div className={styles.listheader}><h3 className={styles.headerText}>기안 진행 문서</h3></div>
                <div className={styles.tableWrapper}>
                    {isListLoading ? (
                        <Loading /> // 리스트 데이터를 불러오는 동안 로딩 컴포넌트 표시
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    )
}
