import React, { useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';
import { useMemberStore } from '../../../../../../../store/store';

export const PopupWindow = ({ setShowPopup }) => {
    const { sessionData } = useMemberStore();

    const closePop = () => {
        setShowPopup(false);
    };
    useEffect(() => {
        if (!sessionData || !sessionData.empId) return; // sessionData가 없으면 로직을 실행하지 않음

        const todayDate = new Date().toISOString().split('T')[0]; // 오늘 날짜 (형식: '2024-08-05')

        axios.get(`${BaseUrl()}/adminpopup/today`)
            .then(resp => {
                const announcements = resp.data;

                if (announcements.length > 0) {
                    announcements.forEach((announcement) => {
                        const userId = sessionData.empId;
                        const popupId = announcement.popSeq;
                        // localStorage.setItem(`${userId}_${popupId}_dismissedToday`,null);
                        // localStorage.setItem(`${userId}_${popupId}_dismissed`,false);
                        const popupDismissed = localStorage.getItem(`${userId}_${popupId}_dismissed`);
                        const popupDismissedToday = localStorage.getItem(`${userId}_${popupId}_dismissedToday`);

                        
                        if (popupDismissed === 'true' || popupDismissedToday === todayDate) {
                            return; // 이 팝업을 다시 표시하지 않음
                        }

                        const popup = window.open('', '_blank', 'width=600,height=400,scrollbars=yes');

                        if (!popup) {
                            alert('팝업 창을 열 수 없습니다. 팝업 차단을 확인하세요.');
                            return;
                        }

                        const content = `
                            <html>
                            <head>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        margin: 20px;
                                        padding: 10px;
                                        background-color: #f0f0f0;
                                    }
                                    h1 {
                                        color: #333;
                                        height:15%;
                                    }
                                    .content{
                                        margin-top: 20px;
                                        height:70%;
                                        overflow: auto;
                                    }
                                    .button{
                                        height:15%;
                                        display:flex;
                                        justify-content:center;
                                    }
                                    button {
                                        padding: 10px 20px;
                                        margin: 5px;
                                        border: none;
                                        background-color: #4CAF50;
                                        color: white;
                                        cursor: pointer;
                                        font-size: 14px;
                                    }
                                    button:hover {
                                        background-color: #45a049;
                                    }
                                </style>
                                <script>
                                    function todayDismiss() {
                                        window.opener.onTodayDismiss('${popupId}');
                                        window.close();
                                    }
                                    
                                    function permanentDismiss() {
                                        window.opener.onPermanentDismiss('${popupId}');
                                        window.close();
                                    }
                                </script>
                                <title>${announcement.popTitle || 'Popup Window'}</title>
                            </head>
                            <body>
                                <h1>${announcement.popTitle || ''}</h1>
                                <div class='content'>${announcement.popContent || ''}</div>
                                <div class='button'>
                                <button onclick="window.close()">닫기</button>
                                <button onclick="todayDismiss()">오늘 하루 보지 않기</button>
                                <button onclick="permanentDismiss()">더 이상 보지 않기</button>
                                </div>
                            </body>
                            </html>
                        `;

                        popup.document.write(content);
                        popup.document.close();

                      
                    });
                } else {
                    closePop(); // 공지글이 없을 경우 팝업 창 닫기
                }
            })
            .catch(error => {
                console.error('API 호출 오류:', error);
                closePop();
            });
           
    }, [sessionData]); // sessionData가 변경될 때마다 실행

    // '오늘 하루 보지 않기' 버튼 클릭 핸들러
    window.onTodayDismiss = (popupId) => {
        const todayDate = new Date().toISOString().split('T')[0];
        const userId = sessionData.empId;
        localStorage.setItem(`${userId}_${popupId}_dismissedToday`, todayDate);
        console.log(`${userId}_${popupId}_dismissedToday`);
       
    };

    // '더 이상 보지 않기' 버튼 클릭 핸들러
    window.onPermanentDismiss = (popupId) => {
        const userId = sessionData.empId;
        localStorage.setItem(`${userId}_${popupId}_dismissed`, 'true');
        console.log(`${userId}_${popupId}_dismissed`);
    };
};
