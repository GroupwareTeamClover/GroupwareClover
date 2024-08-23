import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { Bar, Line, Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, TimeScale, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Chart as ChartJS, ArcElement, TimeScale, LineElement, PointElement, LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend } from 'chart.js'; // BarElement, CategoryScale 추가

import 'chartjs-adapter-date-fns';

import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import {  FaExchangeAlt, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { MdMale, MdFemale } from 'react-icons/md';




// Chart.js 구성 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(TimeScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);
ChartJS.register(BarElement, CategoryScale); // BarElement, CategoryScale 등록


export const Dashboard = () => {
    const [genderData, setGenderData] = useState({ male: 0, female: 0 });
    const [workerData, setWorkerData] = useState({ regular: 0, irregular: 0 , contract:0});
    const [empData, setEmpData] = useState({ newMem: 0, ingMem: 0 , outMem:0});
    const [newMemMonth, setNewMonth] = useState(0);
    const [exitData, setExitData] = useState([]);
    const [deptData, setDeptData] = useState({ '총무':0, '인사':0, '사무':0, '유통':0, '경영':0, '미정':0})

    useEffect(() => {
        axios.get(`${BaseUrl()}/adminmember/gender`)
            .then((resp) => {
                const maleCount = resp.data.find(item => item.EMP_GENDER === 'M')?.COUNT || 0;
                const femaleCount = resp.data.find(item => item.EMP_GENDER === 'F')?.COUNT || 0;
                setGenderData({ male: maleCount, female: femaleCount });
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    useEffect(() => {
        axios.get(`${BaseUrl()}/adminmember/worker`)
            .then((resp) => {
                const regularCount = resp.data.find(item => item.WORKER_STATE_CODE === 1)?.COUNT || 0;
                const irregularCount = resp.data.find(item => item.WORKER_STATE_CODE === 2)?.COUNT || 0;
                const contractCount = resp.data.find(item => item.WORKER_STATE_CODE === 3)?.COUNT || 0;
                const adminCount = resp.data.find(item => item.WORKER_STATE_CODE === 0)?.COUNT || 0;
                setWorkerData({ regular: regularCount, irregular: irregularCount , contract: contractCount, admin: adminCount});
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    useEffect(() => {
        axios.get(`${BaseUrl()}/adminmember/countmem`)
            .then((resp) => {
                const newMemCount = resp.data.find(item => item.EMP_STATE_CODE === 0)?.COUNT || 0;
                const ingMemCount = resp.data.find(item => item.EMP_STATE_CODE === 1)?.COUNT || 0;
                const outMemCount = resp.data.find(item => item.EMP_STATE_CODE === 2)?.COUNT || 0;
                setEmpData({ newMem: newMemCount, ingMem: ingMemCount , outMem: outMemCount});
            })
            .catch(error => console.error('Error fetching data:', error));        
        
        axios.get(`${BaseUrl()}/adminmember/countNewMonth`)
            .then((resp) => {
                const newMemMonthCount = resp.data[0]?.COUNT || 0;
                setNewMonth(newMemMonthCount);
            })
            .catch(error => console.error('Error fetching data:', error));      
    }, []);
    useEffect(() => {
        axios.get(`${BaseUrl()}/adminmember/deptCount`)
        .then((resp) => {
            const a = resp.data.find(item => item.DEPT_CODE === 1)?.COUNT  || 0;
            const b = resp.data.find(item => item.DEPT_CODE === 2)?.COUNT  || 0;
            const c = resp.data.find(item => item.DEPT_CODE === 3)?.COUNT  || 0;
            const d = resp.data.find(item => item.DEPT_CODE === 4)?.COUNT  || 0;
            const e = resp.data.find(item => item.DEPT_CODE === 5)?.COUNT  || 0;
            const none = resp.data.find(item => item.DEPT_CODE === 99)?.COUNT  || 0;
            setDeptData({ '총무':a, '인사':b, '사무':c, '유통':d, '경영':e, '미정':none})
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // 원형 차트 데이터
    const pieChartData = {
        labels: ['Male', 'Female'],
        datasets: [{
            label: 'Gender Distribution',
            data: [genderData.male, genderData.female],
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
        }],
    };
    // 
    const pieChartOptions = {
        plugins: {
            tooltip: {
                // 툴팁 설정을 원하는 대로 조정
            },
            legend: {
                display: true,
                position: 'bottom', // 범례를 하단에 배치
                align: 'start', // 범례 정렬
                labels: {
                    boxWidth: 20,
                    padding: 15
                }
            },
            datalabels: {
                display: false, // 데이터 라벨을 숨깁니다.
            }
        },
        layout: {
            padding: {
                right: 50 // 차트의 오른쪽 여백을 조정하여 범례와의 간격을 설정
            }
        }
    };

    // 부서 막대
      // 부서별 인원수 막대 차트 데이터
      const barChartData = {
        labels: Object.keys(deptData), // 부서명 배열
        datasets: [{
            label: '부서별 인원 수',
            data: Object.values(deptData), // 각 부서별 인원수 배열
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)', // 총무 부서 색상
                'rgba(54, 162, 235, 0.6)', // 인사 부서 색상
                'rgba(255, 206, 86, 0.6)', // 사무 부서 색상
                'rgba(75, 192, 192, 0.6)', // 유통 부서 색상
                'rgba(153, 102, 255, 0.6)', // 경영 부서 색상
                'rgba(255, 159, 64, 0.6)'  // 미정 부서 색상
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
        }],
    };
    const barChartOptions = {
        plugins: {
            legend: {
                display: false, // 범례 비활성화
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // X축 그리드 비활성화
                },
                ticks: {
                    color: '#ffffff', // 부서명 글자 색상 흰색
                    font: {
                        size: 14, // 폰트 크기 조정 가능
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', // Y축 그리드 색상
                },
                ticks: {
                    color: '#ffffff', // Y축 눈금 색상
                },
            },
        },
    };

    return (
        <div className={styles.container}>
            <div className={styles.topRow}>
                <div className={styles.statItem}>
                    <div className={styles.chartTitle}>사원 규모</div>
                    <div className={styles.statItemContent}>
                        <div className={styles.statTitle}>정규직</div>
                        <div className={styles.statValue}>{workerData.regular}</div>
                    </div>
                    <div className={styles.statItemContent}>
                        <div className={styles.statTitle}>계약직</div>
                        <div className={styles.statValue}>{workerData.contract}</div>
                    </div>
                    <div className={styles.statItemContent}>
                        <div className={styles.statTitle}>비정규직</div>
                        <div className={styles.statValue}>{workerData.irregular}</div>
                    </div>
                    <div className={styles.statItemContent}>
                        <div className={styles.statTitle}>관리자</div>
                        <div className={styles.statValue}>{workerData.admin}</div>
                    </div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.newbox}>
                        <div className={styles.newchartWrapper}>
                            <div className={styles.chartTitle}> 이번달 신규 입사</div>
                            <div className={styles.NewMemstatValue}><a href='/member/addmem' style={{color:'white', textDecoration:'none'}}>{newMemMonth}</a></div>
                        </div>
                        <div className={styles.newchartWrapperIcon}>
                            <FaUserPlus className={styles.newicon} /> 
                        </div>
                    </div>
                    <div className={styles.statValue} style={{ color: '#ffffff00', textAlign:'left', fontSize:'20px'}}>
                        0
                    </div>
                    <div className={styles.statValue} style={{ color: 'rgba(255, 255, 255, 0.486)', textAlign:'left', fontSize:'20px'}}>
                        Monthly New Hire Rate &nbsp; {empData.ingMem !== 0 ? ((newMemMonth / empData.ingMem)*100).toFixed(2) +'%' : 'N/A'}
                    </div>
                </div>
                
                <div className={styles.statItem}>
                    <div className={styles.newbox}>
                        <div className={styles.newchartWrapper}>
                            <div className={styles.chartTitle}> 이번달 퇴사자 수</div>
                            <div className={styles.NewMemstatValue}>{empData.outMem}</div>
                        </div>
                        <div className={styles.newchartWrapperIcon}>
                            <FaSignOutAlt  className={styles.newicon} /> 
                        </div>
                        
                    </div>
                    <div className={styles.statValue} style={{ color: '#ffffff00', textAlign:'left', fontSize:'20px'}}>
                        0
                    </div>
                    <div className={styles.statValue} style={{ color: 'rgba(255, 255, 255, 0.486)', textAlign:'left', fontSize:'20px'}}>
                        Monthly Employee Turnover Rate &nbsp; {empData.ingMem !== 0 ? ((empData.outMem / empData.ingMem)*100).toFixed(2) +'%' : 'N/A'}
                    </div>
                
                </div>
            </div>
            <div className={styles.bottomRow}>
                <div className={styles.linestatItemLarge}>
                    <div className={styles.statItem}>
                        <Bar data={barChartData} options={barChartOptions} />
                        <div className={styles.chartWrapper}>
                            <div className={styles.chartTitle}>Employee Count by Department</div>
                        </div>
                    </div>
                </div>
                <div className={styles.statItemLarge}>
                    <div className={styles.statItem}>
                         <Pie data={pieChartData} options={pieChartOptions} />
                        <div className={styles.chartWrapper}>
                            <div className={styles.chartTitle}>Gender Distribution</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
