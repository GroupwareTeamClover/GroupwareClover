import styles from './SideMenu.module.css';
import logo from '../../test_logo.png';
import {useNavigate} from "react-router-dom";
import { FaAddressBook } from 'react-icons/fa';
import { IoHome } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaListAlt } from "react-icons/fa";
import { GiTalk } from "react-icons/gi";

export const AdminSideMenu = () => {

  const navi = useNavigate();

  return (
    <div className={ styles.navgation }>
      <img src={logo} alt="logo" />
      <button onClick={()=>{navi("/")}}>
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