import React, { useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';

export const PopupWindow = ({ onClose }) => {
    useEffect(() => {
        // 팝업 표시 여부를 체크
        const popupDismissed = localStorage.getItem('popupDismissed');
        const popupDismissedToday = localStorage.getItem('popupDismissedToday');
        const todayDate = new Date().toLocaleDateString(); // 오늘 날짜 (형식: '2024-08-05')

        if (popupDismissed === 'true' || popupDismissedToday === todayDate) {
            onClose(); // 팝업 표시 안함
            return;
        }

        // 오늘 날짜를 조회하기 위해서 API 호출
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
                                <title>${announcement.popTitle || 'Popup Window'}</title>
                            </head>
                            <body>
                                <h1>${announcement.popTitle || ''}</h1>
                                <div>${announcement.popContent || ''}</div>
                                <button onclick="window.close()">닫기</button>
                                <button onclick="window.opener.onTodayDismiss()">오늘 하루 보지 않기</button>
                                <button onclick="window.opener.onPermanentDismiss()">더 이상 보지 않기</button>
                            </body>
                            </html>
                        `;

                        popup.document.write(content);
                        popup.document.close();
                    });
                } else {
                    onClose(); // 공지글이 없을 경우 팝업 창 닫기
                }
            })
            .catch(error => {
                console.error('API 호출 오류:', error);
                onClose();
            });
    }, [onClose]);

    // '오늘 하루 보지 않기' 버튼 클릭 핸들러
    window.onTodayDismiss = () => {
        const todayDate = new Date().toLocaleDateString();
        localStorage.setItem('popupDismissedToday', todayDate);
        window.location.reload(); // 새로고침 후 팝업 상태 업데이트
        onClose(); // 팝업 닫기
    };

    // '더 이상 보지 않기' 버튼 클릭 핸들러
    window.onPermanentDismiss = () => {
        localStorage.setItem('popupDismissed', 'true');
        window.location.reload(); // 새로고침 후 팝업 상태 업데이트
        onClose(); // 팝업 닫기
    };

    return null; // UI 요소 없이 백그라운드 작업만 수행
};
