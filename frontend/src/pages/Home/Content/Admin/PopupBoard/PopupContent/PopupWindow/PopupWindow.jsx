import React, { useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../../../../../../../commons/config';
import { useMemberStore } from '../../../../../../../store/store';
import { smallAlert } from '../../../../../../../commons/common';

export const PopupWindow = ({ setShowPopup }) => {
    const { sessionData } = useMemberStore();
    const openPopupIds = new Set();

    const closePop = () => {
        setShowPopup(false);
        openPopupIds.forEach(popupId => {
            const popup = window.open('', popupId);
            if (popup && !popup.closed) {
                popup.close();
            }
        });
        openPopupIds.clear();
    };

    const handleDownload = async (fileUrl, fileName) => {
        try {
            const response = await axios.get(`${BaseUrl()}/attachment/download`, {
                params: { fileUrl },
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
            });

            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('다운로드 중 에러 발생:', error);
        }
    };

    useEffect(() => {
        if (!sessionData || !sessionData.empId) return;

        const todayDate = new Date().toISOString().split('T')[0];

        axios.get(`${BaseUrl()}/adminpopup/today`)
            .then(async resp => {
                const announcements = resp.data;
                let downPosition = 10;
                let leftPosition = 10;

                if (announcements.length > 0) {
                    for (const announcement of announcements) {
                        const userId = sessionData.empId;
                        const popupId = announcement.popSeq;
                        const popupDismissed = localStorage.getItem(`${userId}_${popupId}_dismissed`);
                        const popupDismissedToday = localStorage.getItem(`${userId}_${popupId}_dismissedToday`);

                        if (popupDismissed === 'true' || popupDismissedToday === todayDate) {
                            continue;
                        }

                        if (openPopupIds.has(popupId)) {
                            const popup = window.open('', popupId);
                            if (popup && !popup.closed) {
                                popup.focus();
                                continue;
                            }
                        }

                        const fileResp = await axios.get(`${BaseUrl()}/attachment/popup/${popupId}`);
                        const files = fileResp.data;

                        const popup = window.open('', popupId, `width=600,height=600,left=${leftPosition},top=${downPosition},scrollbars=yes,resizable=no`);

                        if (!popup) {
                            smallAlert('팝업 창을 열 수 없습니다. 팝업 차단을 확인하세요.');
                            continue;
                        }

                        openPopupIds.add(popupId);
                        localStorage.setItem(`${userId}_${popupId}_open`, 'true');

                        let fileContent = '';
                        if (files.length > 0) {
                            files.forEach((file, i) => {
                                fileContent += `<p style="cursor:pointer" onclick="window.opener.handleDownload('${file.attachmentSysname}', '${file.attachmentOriname}')">${i + 1}. ${file.attachmentOriname}</p>`;
                            });
                        }

                        const popupContent = `
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
                                    height:80%;
                                    padding: 20px;
                                    text-align: center;
                                    line-height: 1.6;
                                    overflow-y: auto;
                                    word-break: break-all;
                                }
                                .file-header {
                                    padding: 10px;
                                    text-align: center;
                                    background-color: #e9ecef;
                                    cursor: pointer;
                                    border-top: 1px solid #eaeaea;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                }
                                .file-content {
                                    padding: 10px;
                                    overflow:auto;
                                    height:20%;
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
                                            if (checked) {
                                                window.opener.onTodayDismiss('${popupId}');
                                                window.close();
                                            }
                                        }

                                        function handlePermanentCheckboxChange(checked) {
                                            isPermanentChecked = checked;
                                            if (checked) {
                                                window.opener.onPermanentDismiss('${popupId}');
                                                window.close();
                                            }
                                        }

                                        // 파일 박스 토글 핸들러
                                        function toggleFileBox() {
                                            const fileBox = document.querySelector('.file-content');
                                            const fileHeader = document.querySelector('.file-header');
                                            if (fileBox.style.display === 'none') {
                                                fileBox.style.display = 'block';
                                                fileHeader.textContent = '첨부파일 (${files.length}) ▲';
                                            } else {
                                                fileBox.style.display = 'none';
                                                fileHeader.textContent = '첨부파일 (${files.length}) ▼';
                                            }
                                        }
                                    </script>
                        </head>
                        <body>
                            <div class="popup-container">
                                    <div class="header">
                                        <h1>${announcement.popTitle || '공지사항'}</h1>
                                    </div>
                                <div class="popup-content">
                                    <div class="content">
                                        ${announcement.popContent || '내용이 없습니다.'}
                                    </div>
                                    ${files.length > 0 ? `
                                    <div class="file-header" onclick="toggleFileBox()">
                                        첨부파일 (${files.length}) ▼
                                    </div>
                                    <div class="file-content" style="display: none;">
                                        ${fileContent}
                                    </div>` : ''}
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

                        popup.document.write(popupContent);
                        popup.document.close();

                        downPosition += 50;
                        leftPosition += 60;
                    }
                } else {
                    closePop();
                }
            })
            .catch(error => {
                console.error('API 호출 오류:', error);
                closePop();
            });

        return () => {
            closePop();
        };
    }, [sessionData]);

    window.onTodayDismiss = (popupId) => {
        const todayDate = new Date().toISOString().split('T')[0];
        const userId = sessionData.empId;
        localStorage.setItem(`${userId}_${popupId}_dismissedToday`, todayDate);
        localStorage.removeItem(`${userId}_${popupId}_open`);
        openPopupIds.delete(popupId);
    };

    window.onPermanentDismiss = (popupId) => {
        const userId = sessionData.empId;
        localStorage.setItem(`${userId}_${popupId}_dismissed`, 'true');
        localStorage.removeItem(`${userId}_${popupId}_open`);
        openPopupIds.delete(popupId);
    };

    window.handleDownload = handleDownload;
};
