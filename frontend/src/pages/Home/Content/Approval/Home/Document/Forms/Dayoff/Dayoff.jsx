import { useEffect, useState } from 'react';
import styles from './Dayoff.module.css'
import { set } from 'date-fns';

export const Dayoff =()=>{

    const today = new Date().toISOString().split('T')[0];

    //[시작일 날짜]
    const [startDate, setStartDate]= useState(null);
    const handleStartDate=(e)=>{
        setStartDate(e.target.value);
        if (e.target.value > endDate) {
            setEndDate(e.target.value); // 시작일이 종료일보다 나중이면 종료일을 자동으로 시작일로 설정
        }
    }

    //[종료일 날짜]
    const [endDate, setEndDate]= useState(null);
    const handleEndDate=(e)=>{
        setEndDate(e.target.value)
    }

    //[시작일과 종료일 체크박스] 선택 
    //[오전 오후 radioButton] 선택
    const [dateSelection, setDateSelection] = useState({
        isStartDateChecked: false,
        isEndDateChecked: false,
        start: '', // 'morning' 또는 'afternoon'
        end: '',   // 'morning' 또는 'afternoon'
    });

    const handleCheckboxChange = (key) => {
        setDateSelection((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const handleRadioChange = (key, value) => {
        setDateSelection((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    //시작일, 종료일 체크박스 선택에 따른 오전/오후선택 초기화
    useEffect(()=>{
        if(!dateSelection.isStartDateChecked){
            setDateSelection((prevState)=>({
                ...prevState,
                start: '' //시작일의 오전/오후 선택 초기화
            }))
        }

        if(!dateSelection.isEndDateChecked){
            setDateSelection((prevState)=>({
                ...prevState,
                end: '' //종료일의 오전/오후 선택 초기화
            }))
        }
    },[startDate, endDate])

    // 시작일과 종료일이 날짜가 같은 경우 종료일 필드 비활성화 및 반차 선택 옵션 조정
    useEffect(() => {
        if (startDate === endDate) {
            setDateSelection((prevState) => ({
                ...prevState,
                isEndDateChecked: false, // 종료일 체크박스 비활성화
                end: '', // 종료일 오전/오후 선택 초기화
            }));
        }
    }, [startDate, endDate]);

    useEffect(()=>{
        console.log(`시작일 : ${startDate}`);
        console.log(`종료일 : ${endDate}`);
    }, [startDate, endDate])

    return(
        <div className={styles.container}>
            <table className={styles.table}>
                <tr>
                    <th className={styles.th}>휴가 종류</th>
                    <td className={styles.td}>
                        <select className={styles.selectType}>
                            <option value={'연차'}>연차</option>
                            <option value={'조퇴'}>조퇴</option>
                            <option value={'지각'}>지각</option>
                            <option value={'공가'}>공가</option>
                            <option value={'질병휴가'}>질병휴가</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th className={styles.th}>기간 및 일시</th>
                    <td className={styles.td}>
                        <input type='date' min={today} onChange={handleStartDate} value={startDate}></input>
                        &nbsp;~&nbsp;
                        <input type='date' min={today} onChange={handleEndDate} value={endDate} disabled={!startDate}></input>
                        &nbsp;사용일수 : &nbsp;
                        <input type='text'></input>
                    </td>
                </tr>
                <tr>
                    <th className={styles.th}> 반차 여부</th>
                    <td className={styles.td}>
                        <input type='checkbox' checked={dateSelection.isStartDateChecked} onChange={() => handleCheckboxChange('isStartDateChecked')} />
                        <label>{` 시작일 ( `}</label>
                        <input type='radio' name='start' disabled={!dateSelection.isStartDateChecked} checked={dateSelection.start === 'morning'} onChange={() => handleRadioChange('start', 'morning')}/><label>{`오전 `}</label>
                        <input type='radio' name='start' disabled={!dateSelection.isStartDateChecked} checked={dateSelection.start === 'afternoon'} onChange={() => handleRadioChange('start', 'afternoon')}/><label>{`오후 ) `}</label>
                        <input type='checkbox' checked={dateSelection.isEndDateChecked} onChange={() => handleCheckboxChange('isEndDateChecked')} disabled={startDate === endDate}/>
                        <label>{` 종료일 ( `}</label>
                        <input type='radio' name='end' disabled={!dateSelection.isEndDateChecked} checked={dateSelection.end === 'morning'} onChange={() => handleRadioChange('end', 'morning')}/><label>{`오전 `}</label>
                        <input type='radio' name='end' disabled={!dateSelection.isEndDateChecked} checked={dateSelection.end === 'afternoon'} onChange={() => handleRadioChange('end', 'afternoon')}/><label>{`오후 )`}</label>
                    </td>
                </tr>
                <tr>
                    <th className={styles.th}>연차 일수</th>
                    <td className={styles.td}>
                        <span>{`잔여연차 : `}</span><input type='text'></input>
                        <span>{` 신청연차 : `}</span><input type='text'></input>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2} className={styles.finaltd}>
                        {`※ "휴가 사유" 작성란은 삭제되었습니다.`}<br/>
                        {`1. 연차의 사용은 근로기준법에 따라 전년도에 발생한 개인별 잔여 연차에 한하여 사용.`}<br/>
                        {`단, 최초 입사시에는 근로 기준법에 따라 발생 예정된 연차를 차용하여 월 1회 사용 할 수 있다.`}<br/>
                        {`2. 경조사 휴가는 행사일을 증명할 수 있는 가족 관계 증명서 또는 등본, 청첩장 등 제출`}<br/>
                        {`3. 공가(예비군/민방위)는 사전에 통지서를, 사후에 참석증을 반드시 제출`}
                    </td>
                </tr>
            </table>
        </div>
    )
}
