import React, { useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';
import { useMemberStore } from '../../../../../../../store/store';

export const PopupWindow = ({ setShowPopup }) => {
    const { sessionData } = useMemberStore();
    const openPopupIds = new Set(); // 열려 있는 팝업 ID를 저장할 Set

    console.log(sessionData.empId)
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

                        const popup = window.open('', popupId, 'width=500,height=600,left=0, top='+ leftPosition+', scrollbars=yes');

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
                                    @font-face {
                                        font-family: 'ONE-Mobile-Title';
                                        src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/ONE-Mobile-Title.woff') format('woff');
                                        font-weight: normal;
                                        font-style: normal;
                                    }
                                    body {
                                        margin: 20px;
                                        padding: 10px;
                                        background-color: #f0f0f0;
                                    }
                                    .header{
                                        height:10%;
                                    }
                                    
                                    h1 {
                                        font-family: 'ONE-Mobile-Title', sans-serif;
                                        // color: #333;
                                        color: black;
                                        height:15%;
                                        text-align:center;
                                    }
                                    .content{
                                        padding: 0 10px;
                                        margin-top: 20px;
                                        height:80%;
                                        overflow: auto;
                                    }
                                    .button{
                                   
                                        height:10%;
                                        display:flex;
                                        justify-content:center;
                                    }
                                    .button button {
                                        border: none;
                                        background-color: #4CAF50;
                                        color: white;
                                        cursor: pointer;
                                        height:50%;
                                        margin-left: 10px;
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
                                <div class='header'>
                                    <h1>${announcement.popTitle || ''}</h1>
                                </div>
                                <div class='content'>${announcement.popContent || ''}</div>
                                <div class='button'>
                                    <button onclick="todayDismiss()">x</button>오늘 하루 보지 않기
                                    <button onclick="permanentDismiss()">x</button>더 이상 보지 않기
                                </div>
                            </body>
                            </html>
                        `;
                        
                        popup.document.write(content);
                        popup.document.close();
                        
                    leftPosition +=50;
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
