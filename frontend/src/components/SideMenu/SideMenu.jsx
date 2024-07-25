import styles from './SideMenu.module.css';
import logo from '../../test_logo.png';
import {useNavigate} from "react-router-dom";
import { FaAddressBook } from 'react-icons/fa';
import { IoHome } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaListAlt } from "react-icons/fa";
import { GiTalk } from "react-icons/gi";

export const SideMenu = () => {

  const navi = useNavigate();

  return (
    <div className={ styles.navgation }>
      <img src={logo} alt="logo" />
      <button onClick={()=>{navi("/")}}>
        <IoHome />
        <span>Home</span>
      </button>
      <button onClick={()=>{navi("calendar")}}>
        <FaCalendarDays /> 
        <span>Calendar</span>
      </button>
      <button onClick={()=>{navi("address")}}>
        <FaAddressBook /> 
        <span>Address</span>
      </button>
      <button onClick={()=>{navi("mail")}}>
        <LiaClipboardListSolid /> 
        <span>Documentation</span>
      </button>
      <button onClick={()=>{navi("community")}}>
        <FaListAlt /> 
        <span>Community</span>
      </button>
      <button onClick={()=>{navi("chat")}}>
        <GiTalk /> 
        <span>Messenger</span>
      </button>
    </div>
  )
}