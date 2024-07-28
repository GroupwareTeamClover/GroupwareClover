import styles from './SideMenu.module.css';
import React from "react";
import logo from '../../test_logo.png';
import {Link, useNavigate} from "react-router-dom";
import { FaAddressBook } from 'react-icons/fa';
import { IoHome } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaListAlt } from "react-icons/fa";
import { GiTalk } from "react-icons/gi";
import {HiMenuAlt3} from "react-icons/hi";

export const SideMenu = ({ open, setOpen }) => {

    const navi = useNavigate();

    const menus = [
        {name: "Home", link: "/", icon: IoHome},
        {name: "Calendar", link: "calendar", icon: FaCalendarDays},
        {name: "Address", link: "address", icon: FaAddressBook},
        {name: "Approval", link: "approval", icon: LiaClipboardListSolid},
        {name: "Community", link: "community", icon: FaListAlt},
        {name: "Messenger", link: "chat", icon: GiTalk},
    ]

    const handleSideToggle = () => {
        setOpen( prev => {
            const sideState = !prev
            if (sideState) localStorage.setItem("sidebar", "true");
            else localStorage.setItem("sidebar", "false");
            return sideState
        });
    }

  return (
      <div className={styles.container}>
          <div className={open ? styles.sideFull : styles.sideShort}>
              <div className={styles.toggle}>
                  <HiMenuAlt3 size={30} className="icons" onClick={handleSideToggle}/>
              </div>
              <div className={styles.menus}>
                  {
                      menus.map((menu, i) => {
                          return (
                              <Link to={menu?.link} key={i} className={styles.menuLink}>
                                  <div>
                                      {React.createElement(menu?.icon, {size: "30", color: "white"})}
                                  </div>
                                  <h3 className={open ? styles.menuTitle : styles.menuTitleAction}>{menu?.name}</h3>
                              </Link>
                          );
                      })
                  }
              </div>
          </div>
      </div>
      // <div className={ styles.navgation }>
      //   <img src={logo} alt="logo" />
      //   <button onClick={()=>{navi("/")}}>
      //     <IoHome />
      //     <span>Home</span>
      //   </button>
      //   <button onClick={()=>{navi("calendar")}}>
      //     <FaCalendarDays />
      //     <span>Calendar</span>
      //   </button>
      //   <button onClick={()=>{navi("address")}}>
      //     <FaAddressBook />
      //     <span>Address</span>
      //   </button>
      //   <button onClick={()=>{navi("approval")}}>
      //     <LiaClipboardListSolid />
      //     <span>Approval</span>
      //   </button>
      //   <button onClick={()=>{navi("community")}}>
      //     <FaListAlt />
      //     <span>Community</span>
      //   </button>
      //   <button onClick={()=>{navi("chat")}}>
      //     <GiTalk />
      //     <span>Messenger</span>
      //   </button>
      // </div>
  )
}