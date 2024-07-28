import styles from './SideMenu.module.css';
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

  const [dropdown, setDropdown] = useState({
    home: false,
    member: false,
    popup: false,
    community: false,
    log: false,
  });

  const toggleDropdown = (menu) => {
    setDropdown(prevState => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <div className={ styles.navgation }>
      <img src={logo} alt="logo" />
      <button onClick={() => toggleDropdown('home')}>
        <IoHome />
        <span>Home</span>
      </button>
      {dropdown.home && (
        <div className={styles.dropdown}>
          <button onClick={() => navi("/")}>Sub Home 1</button>
          <button onClick={() => navi("member")}>Sub Home 2</button>
        </div>
      )}

      <button onClick={() => toggleDropdown('member')}>
        <FaCalendarDays /> 
        <span>조직관리</span>
      </button>
      {dropdown.member && (
        <div className={styles.dropdown}>
          <button onClick={() => navi("member")}>통합 사원 목록</button>
          <button onClick={() => navi("/member/addmem")}>가입 승인 목록</button>
          <button onClick={() => navi("member")}>삭제 사원 목록</button>
        </div>
      )}
      
      {/* <button onClick={()=>{navi("/")}}>
        <IoHome />
        <span>Home</span>
      </button>
      <button onClick={()=>{navi("member")}}>
        <FaCalendarDays /> 
        <span>조직관리</span>
      </button> */}
      <button onClick={()=>{navi("popup")}}>
        <FaAddressBook /> 
        <span>팝업공지관리</span>
      </button>
      <button onClick={()=>{navi("/community")}}>
        <LiaClipboardListSolid /> 
        <span>게시글관리</span>
      </button>
      <button onClick={()=>{navi("log")}}>
        <FaListAlt /> 
        <span>보안관리</span>
      </button>
      
    </div>
  )
}