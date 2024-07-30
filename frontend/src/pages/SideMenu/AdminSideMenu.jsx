import styles from './AdminSideMenu.module.css';
import logo from '../../test_logo.png';
import {useNavigate} from "react-router-dom";
import { FaAddressBook } from 'react-icons/fa';
import { IoHome } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaListAlt } from "react-icons/fa";
import { GiTalk } from "react-icons/gi";
import { useState } from 'react';

export const AdminSideMenu = () => {

  const navi = useNavigate();
   //화면 url, 상태 navi에 넣기
   const handleNavigation = (path, type) => {
    navi(path, { state: { type } });
  };

  const [dropdown, setDropdown] = useState({
    home: false,
    member: false,
    popup: false,
    community: false,
    log: false,
  });

  const [selectedMenu, setSelectedMenu] = useState('');
  const handleMenuClick = (menu, path, type) => {
    setSelectedMenu(menu);
    // navi(path);
    navi(path, { state: { type } });
  };

  const toggleDropdown = (menu) => {
    setDropdown(prevState => ({
      [menu]: !prevState[menu]
    }));
  };

  return (
    <div className={styles.container}>
      <div className={ styles.sideFull }>
        <div className={styles.toggle}>
          <div className={styles.icons}></div>
          {/* <HiMenuAlt3 size={30} className={styles.icons} onClick={handleSideToggle} /> */}
        </div>
        <div className={styles.menus}>
          <button className={styles.menuLink} onClick={() => handleMenuClick('home', '/', 'Home')}
            style={{ color: selectedMenu == 'home' ? 'orange' : 'black' }}
          >
            <IoHome />
            <span>Home</span>
          </button>
        

          <button className={styles.menuLink} onClick={() => toggleDropdown('member')}>
            <FaCalendarDays /> 
            <span>조직관리</span>
          </button>
          {dropdown.member && (
            <div className={styles.dropdown}>
              <button onClick={() => handleMenuClick('member', 'member','통합사원목록')}
                style={{ color: selectedMenu == 'member' ? 'orange' : 'black'}}>
                통합 사원 목록
              </button>
              <button onClick={() => handleMenuClick('addMember','member/addmem','가입승인목록')}
                style={{ color: selectedMenu == 'addMember' ? 'orange' : 'black'}}>
                가입 승인 목록
              </button>
              <button onClick={() => handleMenuClick('delMember','member/delmem','삭제사원목록')}
                style={{ color: selectedMenu == 'delMember' ? 'orange' : 'black'}}>
                삭제 사원 목록</button>
            </div>
          )}
          
    {/* ------------팝업공지--------------------- */}
          <button className={styles.menuLink} onClick={() => toggleDropdown('popup')}>
            <FaCalendarDays /> 
            <span>팝업공지관리</span>
          </button>
          {dropdown.popup && (
            <div className={styles.dropdown}>
              <button onClick={() => handleMenuClick('popuplist', 'popup')}
                style={{ color: selectedMenu == 'popuplist' ? 'orange' : 'black'}}>
                공지글 목록
              </button>
              <button onClick={() => handleMenuClick('addMember','popup/write')}
                style={{ color: selectedMenu == 'popupwrite' ? 'orange' : 'black'}}>
                공지 작성하기
              </button>
              
            </div>
          )}


    {/* ---------------------------------------- */}

          {/* <button onClick={()=>{navi("/")}}>
            <IoHome />
            <span>Home</span>
          </button>
          <button onClick={()=>{navi("member")}}>
            <FaCalendarDays /> 
            <span>조직관리</span>
          </button> 
          <button onClick={()=>{navi("popup")}}>
            <FaAddressBook /> 
            <span>팝업공지관리</span>
          </button>*/}
          <button className={styles.menuLink} onClick={()=>{navi("/community")}}>
            <LiaClipboardListSolid /> 
            <span>게시글관리</span>
          </button>
          <button className={styles.menuLink} onClick={()=>{navi("log")}}>
            <FaListAlt /> 
            <span>보안관리</span>
          </button>
        </div>
        
        
      </div>
    </div>
  )
}