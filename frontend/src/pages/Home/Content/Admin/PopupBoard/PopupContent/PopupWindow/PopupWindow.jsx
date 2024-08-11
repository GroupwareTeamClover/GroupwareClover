import React, { useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';
import { useMemberStore } from '../../../../../../../store/store';

export const PopupWindow = ({ setShowPopup }) => {
    const { sessionData } = useMemberStore();
    const openPopupIds = new Set(); // 열려 있는 팝업 ID를 저장할 Set

    const closePop = () => {
        setShowPopup(false);
        openPopupIds.forEach(popupId => {
            const popup = window.open('', popupId); // 팝업 ID로 팝업을 찾기
            if (popup && !popup.closed) {
                popup.close(); // 모든 팝업 창 닫기
            }
        });
        openPopupIds.clear(); // Set 초기화
    };

    useEffect(() => {
        if (!sessionData || !sessionData.empId) return; // sessionData가 없으면 로직을 실행하지 않음

        const todayDate = new Date().toISOString().split('T')[0]; // 오늘 날짜 (형식: '2024-08-05')

        axios.get(`${BaseUrl()}/adminpopup/today`)
            .then(resp => {
                const announcements = resp.data;
                let downPosition = 10;
                let leftPosition = 10;

                if (announcements.length > 0) {
                    announcements.forEach((announcement, i) => {
                        const userId = sessionData.empId;
                        const popupId = announcement.popSeq;
                        const popupDismissed = localStorage.getItem(`${userId}_${popupId}_dismissed`);
                        const popupDismissedToday = localStorage.getItem(`${userId}_${popupId}_dismissedToday`);

                        if (popupDismissed === 'true' || popupDismissedToday === todayDate) {
                            return; // 팝업 안나타나게 처리 ( 더이상 안보기 || 오늘 안보기 )
                        }

                        // 이미 열려 있는 팝업 확인
                        if (openPopupIds.has(popupId)) {
                            // 이미 열린 팝업이 있다면 해당 팝업으로 포커스 이동
                            const popup = window.open('', popupId);
                            if (popup && !popup.closed) {
                                popup.focus();
                                return;
                            }
                        }

                        const popup = window.open('', popupId, 'width=600,height=600,left=0'+ leftPosition+',top=' + downPosition + ',scrollbars=yes,resizable=no');

                        if (!popup) {
                            alert('팝업 창을 열 수 없습니다. 팝업 차단을 확인하세요.');
                            return;
                        }

                        // 팝업 상태 저장
                        openPopupIds.add(popupId);
                        localStorage.setItem(`${userId}_${popupId}_open`, 'true'); // 팝업이 열려 있음을 로컬 스토리지에 저장

                        const content = `
                        <html>
                        <head>
                            <style>
                                @font-face {
                                    font-family: 'ONE-Mobile-Title';
                                    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/ONE-Mobile-Title.woff') format('woff');
                                    font-weight: normal;
                                    font-style: normal;
                                }
                                  body {
                                    margin: 0;
                                    padding: 0;
                                    background-color: #f0f0f0;
                                }
                                .popup-container {
                                    display: flex;
                                    flex-direction: column;
                                    height: 100%;
                                    width: 100%;
                                }
                               
                                .popup-content {
                                    display: flex;
                                    flex-direction: column;
                                    height: 90%;
                                    overflow: hidden;
                                }
                                .header {
                                    padding: 20px;
                                    text-align: center;
                                    background-color: #f8f9fa;
                                    border-bottom: 1px solid #eaeaea;
                                }
                               
                              
                                h1 {
                                    font-size: 1.25em;
                                    margin: 0;
                                    color: #007BFF;
                                }
                                .content {
                                    padding: 20px;
                                    text-align: center;
                                    line-height: 1.6;
                                    overflow-y:auto;
                                }
                                 
                                 .footer {
                                    height: 10%;
                                    display: flex;
                                    justify-content: end;
                                    align-items: center;
                                    background-color: #f8f9fa;
                                    border-top: 1px solid #eaeaea;
                                }

                                .checkbox-group {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    margin: 0 10px;
                                }
                                .checkbox-group input[type="checkbox"] {
                                    margin-right: 10px;
                                }
                              
                            </style>
                            <script>
                                let isTodayChecked = false;
                                let isPermanentChecked = false;

                                function handleTodayCheckboxChange(checked) {
                                    isTodayChecked = checked;
                                }

                                function handlePermanentCheckboxChange(checked) {
                                    isPermanentChecked = checked;
                                }

                                function todayDismiss() {
                                    if (isTodayChecked) {
                                        window.opener.onTodayDismiss('${popupId}');
                                    }
                                    window.close();
                                }
                                
                                function permanentDismiss() {
                                    if (isPermanentChecked) {
                                        window.opener.onPermanentDismiss('${popupId}');
                                    }
                                    window.close();
                                }

                                // 팝업이 닫힐 때 호출되는 이벤트
                                window.addEventListener('beforeunload', () => {
                                    if (isTodayChecked) {
                                        window.opener.onTodayDismiss('${popupId}');
                                    }
                                    if (isPermanentChecked) {
                                        window.opener.onPermanentDismiss('${popupId}');
                                    }
                                });
                                
                              
                            </script>
                        </head>
                        <body>
                            <div class="popup-container">
                                <div class="popup-content">
                                    <div class="header">
                                        <h1>${announcement.popTitle || '공지사항'}</h1>
                                    </div>
                                    <div class="content">
                                        <div>
                                            ${announcement.popContent || '내용이 없습니다.'}
                                        </div>
                                    </div>
                                </div>
                                <div class="footer">
                                    <div class="checkbox-group">
                                        <input type="checkbox" id="today-checkbox" onchange="handleTodayCheckboxChange(this.checked)">
                                        <label for="today-checkbox">오늘 하루 보지 않기</label>
                                    </div>
                                    <div class="checkbox-group">
                                        <input type="checkbox" id="permanent-checkbox" onchange="handlePermanentCheckboxChange(this.checked)">
                                        <label for="permanent-checkbox">더 이상 보지 않기</label>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                        `;

                        popup.document.write(content);
                        popup.document.close();

                        downPosition += 50;
                        leftPosition += 60;
                    });

                } else {
                    closePop(); 
                }
            })
            .catch(error => {
                console.error('API 호출 오류:', error);
                closePop();
            });

        // 컴포넌트 언마운트 시 모든 팝업창을 닫음
        return () => {
            closePop();
        };
    }, [sessionData]); // sessionData가 변경될 때마다 실행

    // '오늘 하루 보지 않기' 버튼 클릭 핸들러
    window.onTodayDismiss = (popupId) => {
        const todayDate = new Date().toISOString().split('T')[0];
        const userId = sessionData.empId;
        localStorage.setItem(`${userId}_${popupId}_dismissedToday`, todayDate);
        localStorage.removeItem(`${userId}_${popupId}_open`); // 팝업 상태를 제거
        openPopupIds.delete(popupId); // 팝업 ID 제거
    };

    // '더 이상 보지 않기' 버튼 클릭 핸들러
    window.onPermanentDismiss = (popupId) => {
        const userId = sessionData.empId;
        localStorage.setItem(`${userId}_${popupId}_dismissed`, 'true');
        localStorage.removeItem(`${userId}_${popupId}_open`); // 팝업 상태를 제거
        openPopupIds.delete(popupId); // 팝업 ID 제거
    };
};
