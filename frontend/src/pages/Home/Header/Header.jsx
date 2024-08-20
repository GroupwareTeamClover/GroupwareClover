import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import logo from '../../../test_logo.png';
import defaultImage from '../../../images/default_avatar.jpg';
import { useMemberStore } from "../../../store/store";
import axios from "axios";
import { BaseUrl } from "../../../commons/config";
import { useNavigate } from "react-router-dom";
import { ImExit } from "react-icons/im";
import { confirmAlert, failAlert, timeAlert } from "../../../commons/common";
import { FaEnvelope } from 'react-icons/fa';
import { useChatStore } from "../../../store/messengerStore";
import ChildChatModal from '../Content/Messenger/Modals/ChildChatModal';

export const Header = () => {
  const navi = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { sessionData, setSign, setAdmin } = useMemberStore();
  const { chatRooms, setChatRooms, updateChatRoom} = useChatStore();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(`${BaseUrl()}/chat/rooms`);
        setChatRooms(response.data);
      } catch (error) {
        console.error('채팅방 목록 조회 오류:', error);
      }
    };

    fetchChatRooms();
  }, [setChatRooms]);

  const handleSignOut = () => {
    confirmAlert("로그아웃 하시겠습니까?").then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${BaseUrl()}/sign`).then(resp => {
          if (resp.data === "ok") {
            sessionStorage.removeItem("sessionUser");
            sessionStorage.removeItem("sessionAdmin");
            setSign(false);
            setAdmin(false);
            timeAlert("로그아웃 성공");
            navi("/");
          } else {
            failAlert("Sign-Out", "로그아웃 실패");
          }
        });
      }
    });
  };

  const currentUserSeq = JSON.parse(sessionStorage.getItem('sessionUser'))?.empSeq;
  const totalUnreadCount = chatRooms.reduce((total, chat) => {
    if (chat.lastMessage && chat.lastMessage.senderSeq !== currentUserSeq) {
      return total + (chat.unreadCount || 0);
    }
    return total;
  }, 0);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.companyLogo}>
          <img src={logo} alt=""/>
          <span>Clover Office</span>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.messageIcon} onClick={() => setIsModalOpen(true)}>
            <FaEnvelope size={24} />
            {totalUnreadCount > 0 && (
              <span className={styles.unreadBadge}>{totalUnreadCount}</span>
            )}
          </div>
          <div className={styles.userAvatar}>
            {sessionData.empAvatar === null ?
              <img src={defaultImage} alt="기본 이미지"/>
              :
              <img src={sessionData.empAvatar} alt="기본 이미지"/>
            }
          </div>
          <ImExit size={30} className={styles.icons} onClick={handleSignOut} />
        </div>
      </div>
      <ChildChatModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        chatRooms={chatRooms}
        updateChatRoom={updateChatRoom}        
      />
    </div>
  );
};