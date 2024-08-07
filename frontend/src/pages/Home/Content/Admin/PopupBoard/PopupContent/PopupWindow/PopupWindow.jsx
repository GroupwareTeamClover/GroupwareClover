import React, { useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';
import { useMemberStore } from '../../../../../../../store/store';


export const PopupWindow = ({ setShowPopup }) => {
    const { sessionData } = useMemberStore();
    let popups = []; // 전역 변수로 팝업 상태 관리 - 여러 팝업 창 = 배열!

    const closePop = () => {
        setShowPopup(false);
        popups.forEach(popup => {
            if (popup) {
                popup.close(); // 모든 팝업 창 닫기
            }
        });
        popups = []; // 배열 초기화
    };
    
    useEffect(() => {
        if (!sessionData || !sessionData.empId) return; // sessionData가 없으면 로직을 실행하지 않음

        const todayDate = new Date().toISOString().split('T')[0]; // 오늘 날짜 (String값: '2024-08-05')

        axios.get(`${BaseUrl()}/adminpopup/today`)
            .then(resp => {
                const announcements = resp.data;

                if (announcements.length > 0) {
                    announcements.forEach((announcement) => {
                        const userId = sessionData.empId;
                        const popupId = announcement.popSeq;
                        // localStorage.setItem(`${userId}_${popupId}_dismissedToday`,null);  // 오늘 안보기 초기화
                        // localStorage.setItem(`${userId}_${popupId}_dismissed`,false);       // 더이상 안보기 초기화
                        const popupDismissed = localStorage.getItem(`${userId}_${popupId}_dismissed`);
                        const popupDismissedToday = localStorage.getItem(`${userId}_${popupId}_dismissedToday`);

                        
                        if (popupDismissed === 'true' || popupDismissedToday === todayDate) {
                            return; // 팝업 안나타나게 처리 ( 더이상 안보기 || 오늘 안보기 )
                        }
                    
                        const popup = window.open('', '_blank', 'width=600,height=400,scrollbars=yes');
                        popups.push(popup); // 배열에 팝업 창 추가

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
                    console.log("공지글 없을때 팝업창 닫기");
                    closePop(); 
                }
            })
            .catch(error => {
                console.error('API 호출 오류 뇸뇸:', error);
                closePop();
            });
         // 컴포넌트 언마운트 시 팝업창을 닫음 ??
         return () => {
            popups.forEach(popup => {
                if (popup) {
                    popup.close();
                }
            });
        };
           
    }, [sessionData]); // sessionData가 변경될 때마다 실행

    // '오늘 하루 보지 않기' 
    window.onTodayDismiss = (popupId) => {
        const todayDate = new Date().toISOString().split('T')[0];
        const userId = sessionData.empId;
        localStorage.setItem(`${userId}_${popupId}_dismissedToday`, todayDate);
        console.log(`${userId}_${popupId}_dismissedToday`);
       
    };

    // '더 이상 보지 않기' 
    window.onPermanentDismiss = (popupId) => {
        const userId = sessionData.empId;
        localStorage.setItem(`${userId}_${popupId}_dismissed`, 'true');
        console.log(`${userId}_${popupId}_dismissed`);
    };
};
