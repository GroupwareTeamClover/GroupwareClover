import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';
import { useMemberStore } from '../../../../../../../store/store';

export const PopupWindow = ({ setShowPopup }) => {
    const { sessionData } = useMemberStore();
    const openPopupIds = new Set(); // 열려 있는 팝업 ID를 저장할 Set

    console.log(sessionData.empId);
    const closePop = () => {
        setShowPopup(false);
        openPopupIds.forEach(popupId => {
            const popup = window.open('', popupId); // 팝업 ID로 팝업을 찾기
            if (popup && !popup.closed) {
                popup.close(); // 모든 팝업 창 닫기
            }
        });
        console.log('Closing all popups:', openPopupIds);
        openPopupIds.clear(); // Set 초기화
    };

    useEffect(() => {
        if (!sessionData || !sessionData.empId) return; // sessionData가 없으면 로직을 실행하지 않음

        const todayDate = new Date().toISOString().split('T')[0]; // 오늘 날짜 (형식: '2024-08-05')

        axios.get(`${BaseUrl()}/adminpopup/today`)
            .then(resp => {
                const announcements = resp.data;
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

                        const popup = window.open('', popupId, 'width=400,height=300,left=0,top=' + leftPosition + ',scrollbars=yes,resizable=no');

                        if (!popup) {
                            alert('팝업 창을 열 수 없습니다. 팝업 차단을 확인하세요.');
                            return;
                        }

                        // 팝업 상태 저장
                        openPopupIds.add(popupId);
                        localStorage.setItem(`${userId}_${popupId}_open`, 'true'); // 팝업이 열려 있음을 로컬 스토리지에 저장
                        console.log('Current popups:', openPopupIds);

                        const content = `
                        <html>
                        <head>
                            <style>
                                body {
                                    font-family: 'Arial', sans-serif;
                                    margin: 0;
                                    padding: 0;
                                    background-color: rgba(0, 0, 0, 0.5);
                                    color: #333;
                                    overflow: hidden;
                                }
                                .popup-container {
                                    width: 100%;
                                    height: 100%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    padding: 20px;
                                }
                                .popup-content {
                                    width: 100%;
                                    max-width: 500px;
                                    background-color: #fff;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    overflow: hidden;
                                    display: flex;
                                    flex-direction: column;
                                }
                                .header {
                                    padding: 20px;
                                    border-bottom: 1px solid #eaeaea;
                                    text-align: center;
                                    background-color: #f8f9fa;
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
                                }
                                .checkbox-group {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    margin: 20px 0;
                                }
                                .checkbox-group input[type="checkbox"] {
                                    margin-right: 10px;
                                }
                                .button-group {
                                    display: flex;
                                    justify-content: center;
                                    padding: 10px;
                                    border-top: 1px solid #eaeaea;
                                    background-color: #f8f9fa;
                                }
                                .button-group button {
                                    border: none;
                                    padding: 10px 20px;
                                    font-size: 1em;
                                    cursor: pointer;
                                    background-color: #007BFF;
                                    color: white;
                                    border-radius: 5px;
                                    margin: 0 10px;
                                    transition: background-color 0.3s ease;
                                }
                                .button-group button:hover {
                                    background-color: #0056b3;
                                }
                                .button-group button:focus {
                                    outline: none;
                                    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
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
                                        <div>${announcement.popContent || '내용이 없습니다.'}</div>
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
                            </div>
                        </body>
                        </html>
                        `;

                        popup.document.write(content);
                        popup.document.close();

                        // 팝업이 완전히 로드된 후 크기 조정
                        popup.onload = function() {
                            const width = Math.min(popup.document.documentElement.scrollWidth, 500); // 가로 최대 500px
                            const height = Math.min(popup.document.documentElement.scrollHeight, 400); // 세로 최대 400px
                            popup.resizeTo(width + 320, height + 620); // 여유 공간 추가
                        };

                        leftPosition += 50;
                    });

                } else {
                    console.log("공지글 없을때 팝업창 닫기");
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
        console.log(`${userId}_${popupId}_dismissedToday`);
    };

    // '더 이상 보지 않기' 버튼 클릭 핸들러
    window.onPermanentDismiss = (popupId) => {
        const userId = sessionData.empId;
        localStorage.setItem(`${userId}_${popupId}_dismissed`, 'true');
        localStorage.removeItem(`${userId}_${popupId}_open`); // 팝업 상태를 제거
        openPopupIds.delete(popupId); // 팝업 ID 제거
        console.log(`${userId}_${popupId}_dismissed`);
    };
};
