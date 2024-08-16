import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { BaseUrl } from '../../../../../commons/config';

// Chart.js 구성 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend);

export const Dashboard = () => {
    const [genderData, setGenderData] = useState({ male: 0, female: 0 });
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

    // 차트 옵션
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

    return (
        <div className={styles.container}>
            <div className={styles.topRow}>
                <div className={styles.statItem}>
                    <div className={styles.chartTitle}>사원 규모</div>
                    <div className={styles.statTitle}>정규직</div>
                    <div className={styles.statValue}>{salesData.total}</div>
                    <div className={styles.statTitle}>계약직</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.chartWrapper}>
                        <div className={styles.chartTitle}>이번달 신규 입사</div>
                        
                    </div>
                </div>
                
                <div className={styles.statItem}>
                    <div className={styles.statTitle}>Monthly Average</div>
                    <div className={styles.statValue}>{salesData.monthlyAverage}</div>
                </div>
            </div>
            <div className={styles.bottomRow}>
                <div className={styles.statItemLarge}>
                    <div className={styles.statTitle}>Max Sales</div>
                    <div className={styles.statValue}>{salesData.max}</div>
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
