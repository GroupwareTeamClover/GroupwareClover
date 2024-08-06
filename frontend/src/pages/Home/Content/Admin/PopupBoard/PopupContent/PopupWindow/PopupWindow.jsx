import React, { useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';

export const PopupWindow = ({ setShowPopup }) => {
    const closePop = () => {
        setShowPopup(false);
    };

    

    useEffect(() => {
        const todayDate = new Date().toISOString().split('T')[0]; // 오늘 날짜 (형식: '2024-08-05')

        axios.get(`${BaseUrl()}/adminpopup/today`)
            .then(resp => {
                console.log(resp.data);
                const announcements = resp.data;

                if (announcements.length > 0) {
                    announcements.forEach((announcement, index) => {
                        const popupId = `popup_${Date.now()}_${index}`;
                        const popupDismissed = localStorage.getItem(`${popupId}_dismissed`);
                        const popupDismissedToday = localStorage.getItem(`${popupId}_dismissedToday`);

                        console.log(popupDismissed)
                        console.log(popupDismissedToday)
                        if (popupDismissed === 'true' || popupDismissedToday === todayDate) {
                            console.log(popupDismissed)
                            console.log(popupDismissedToday)
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
                                <div>${announcement.popContent || ''}</div>
                                <button onclick="window.close()">닫기</button>
                                <button onclick="todayDismiss()">오늘 하루 보지 않기</button>
                                <button onclick="permanentDismiss()">더 이상 보지 않기</button>
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
    }, []);

    // '오늘 하루 보지 않기' 버튼 클릭 핸들러
    window.onTodayDismiss = (popupId) => {
        const todayDate = new Date().toISOString().split('T')[0];
        localStorage.setItem(`${popupId}_dismissedToday`, todayDate);
    };

    // '더 이상 보지 않기' 버튼 클릭 핸들러
    window.onPermanentDismiss = (popupId) => {
        localStorage.setItem(`${popupId}_dismissed`, 'true');
    };
};
