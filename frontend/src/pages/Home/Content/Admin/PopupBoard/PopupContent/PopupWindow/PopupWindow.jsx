import React, { useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';

export const PopupWindow = ({ setShowPopup }) => {
    const closePop =()=>{
        setShowPopup(false)
    }
    useEffect(() => {
        // 팝업 표시 여부를 체크    // popupDismissed true는 다시 나타나지 않도록 함. 
        // localStorage.setItem('popupDismissed',false)
        const popupDismissed = localStorage.getItem('popupDismissed');
        const popupDismissedToday = localStorage.getItem('popupDismissedToday');
        const todayDate = new Date().toISOString().split('T')[0]; // 오늘 날짜 (형식: '2024-08-05')

        console.log(popupDismissedToday);
        console.log(popupDismissed);

        if (popupDismissed === 'true' || popupDismissedToday === todayDate) {
            closePop(); // 팝업 표시 안함
            return;
        }

        axios.get(`${BaseUrl()}/adminpopup/today`)
            .then(resp => {
                console.log(resp.data)
                const announcements = resp.data;

                // 공지글이 있을 경우 팝업 표시
                if (announcements.length > 0) {
                    announcements.forEach(announcement => {
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
                                        window.opener.onTodayDismiss();
                                        window.close();
                                    }
                                    
                                    function permanentDismiss() {
                                        window.opener.onPermanentDismiss();
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
    window.onTodayDismiss = () => {
        const todayDate = new Date().toISOString().split('T')[0];
        localStorage.setItem('popupDismissedToday', todayDate);
    };

    // '더 이상 보지 않기' 버튼 클릭 핸들러
    window.onPermanentDismiss = () => {
        localStorage.setItem('popupDismissed', 'true');
    };

};
