import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, TimeScale, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';
import {  FaUserPlus } from 'react-icons/fa';
import { MdMale, MdFemale } from 'react-icons/md';




// Chart.js 구성 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(TimeScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export const Dashboard = () => {
    const [genderData, setGenderData] = useState({ male: 0, female: 0 });
    const [workerData, setWorkerData] = useState({ regular: 0, irregular: 0 , contract:0});
    const [empData, setEmpData] = useState({ newMem: 0, ingMem: 0 , outMem:0});
    const [exitData, setExitData] = useState([]);

    const [salesData, setSalesData] = useState({ total: 0, monthlyAverage: 0, max: 0 });

    useEffect(() => {
        axios.get(`${BaseUrl()}/adminmember/gender`)
            .then((resp) => {
                const maleCount = resp.data.find(item => item.EMP_GENDER === 'M')?.COUNT || 0;
                const femaleCount = resp.data.find(item => item.EMP_GENDER === 'F')?.COUNT || 0;
                setGenderData({ male: maleCount, female: femaleCount });
            })
            .catch(error => console.error('Error fetching data:', error));

        // Mock sales data - replace with actual API call if needed
        setSalesData({ total: 250, monthlyAverage: 25, max: 50 });
    }, []);
    useEffect(() => {
        axios.get(`${BaseUrl()}/adminmember/worker`)
            .then((resp) => {
                console.log(resp.data)
                const regularCount = resp.data.find(item => item.WORKER_STATE_CODE === 1)?.COUNT || 0;
                const irregularCount = resp.data.find(item => item.WORKER_STATE_CODE === 2)?.COUNT || 0;
                const contractCount = resp.data.find(item => item.WORKER_STATE_CODE === 3)?.COUNT || 0;
                setWorkerData({ regular: regularCount, irregular: irregularCount , contract: contractCount});
            })
            .catch(error => console.error('Error fetching data:', error));

        // Mock sales data - replace with actual API call if needed
        setSalesData({ total: 250, monthlyAverage: 25, max: 50 });
    }, []);
    useEffect(() => {
        axios.get(`${BaseUrl()}/adminmember/countmem`)
            .then((resp) => {
                console.log(resp.data)
                const newMemCount = resp.data.find(item => item.EMP_STATE_CODE === 0)?.COUNT || 0;
                const ingMemCount = resp.data.find(item => item.EMP_STATE_CODE === 1)?.COUNT || 0;
                const outMemCount = resp.data.find(item => item.EMP_STATE_CODE === 2)?.COUNT || 0;
                console.log("newMem "+ newMemCount)
                setEmpData({ newMem: newMemCount, ingMem: ingMemCount , outMem: outMemCount});
            })
            .catch(error => console.error('Error fetching data:', error));

        // Mock sales data - replace with actual API call if needed
        setSalesData({ total: 250, monthlyAverage: 25, max: 50 });
    }, []);
    useEffect(() => {
        axios.get(`${BaseUrl()}/adminmember/exit`)
        .then((resp) => {
            const rawData = resp.data;
                const dateMap = rawData.reduce((acc, item) => {
                    const date = new Date(item.leaveDate).toISOString().split('T')[0]; // 날짜만 추출
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});

                const formattedData = Object.keys(dateMap).map(date => ({
                    date,
                    count: dateMap[date]
                }));

                setExitData(formattedData);
                console.log(formattedData)
            })
            .catch(error => console.error('Error fetching data:', error));

        // Mock sales data - replace with actual API call if needed
        setSalesData({ total: 250, monthlyAverage: 25, max: 50 });
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

     // 퇴사 인원 수 시계열 차트 데이터
     const lineChartData = {
        labels: exitData.map(data => data.date), // 날짜 라벨
        datasets: [{
            label: '퇴사 인원수',
            data: exitData.map(data => data.count), // 퇴사 인원 수
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
        }],
    };

    const lineChartOptions = {
        plugins: {
            tooltip: {
                backgroundColor: '#333', // 툴팁 배경 색상
                titleColor: '#fff', // 툴팁 제목 색상
                bodyColor: '#fff', // 툴팁 본문 색상
                borderColor: '#444', // 툴팁 경계 색상
                borderWidth: 1,},
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#ffffff', // 범례 텍스트 색상
                    font: {
                        size: 14, // 범례 폰트 크기
                        weight: 'bold', // 범례 폰트 굵기
                    },
                },
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM d', // 날짜 형식
                    },
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', // X축 그리드 색상
                },
                ticks: {
                    color: '#ffffff', // X축 눈금 색상
                    font: {
                        size: 12, // X축 폰트 크기
                    },
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', // Y축 그리드 색상
                },
                ticks: {
                    color: '#ffffff', // Y축 눈금 색상
                    font: {
                        size: 12, // Y축 폰트 크기
                    },
                    callback: function(value) {
                        // Y축 눈금을 정수로 포맷
                        return Number.isInteger(value) ? value : value.toFixed(0);
                    },
                    stepSize: 1, // 간격을 1로 설정하여 눈금이 일정하게 표시되도록 조정
                },
                beginAtZero: true, // Y축을 0에서 시작하도록 설정
                suggestedMin: 0, // 최소값 제안
                suggestedMax: 15, // 최대값 제안
            },
        },
        elements: {
            line: {
                tension: 0.1, // 선의 곡률
                borderWidth: 3, // 선의 두께
                borderColor: 'rgba(255, 99, 132, 1)', // 선의 색상
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // 선의 배경 색상
            },
            point: {
                radius: 5, // 포인트의 반지름
                backgroundColor: 'rgba(255, 99, 132, 1)', // 포인트 배경 색상
                borderColor: '#ffffff', // 포인트 테두리 색상
                borderWidth: 2, // 포인트 테두리 두께
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
                </div>
                <div className={styles.statItem}>
                    <div className={styles.newchartWrapper}>
                        <FaUserPlus className={styles.newicon} /> 
                        <div className={styles.chartTitle}> 이번달 신규 입사</div>
                    </div>
                        <div className={styles.NewMemstatValue}>{empData.newMem}</div>
                </div>
                
                <div className={styles.statItem}>
                    <div className={styles.newchartWrapper}>
                        {/* <MdMale className={styles.newicon} />  */}
                        <div className={styles.chartTitle}> 할게 없어</div>
                    </div>
                        <div className={styles.NewMemstatValue}>{empData.newMem}</div>
                </div>
            </div>
            <div className={styles.bottomRow}>
                <div className={styles.linestatItemLarge}>
                    <div className={styles.statItem}>
                        <Line data={lineChartData} options={lineChartOptions} />
                    </div>
                    <div className={styles.chartWrapper}>
                        <div className={styles.chartTitle}>Trends in Employee Turnover Over Time</div>
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
