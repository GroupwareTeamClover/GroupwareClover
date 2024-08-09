import styles from './SideMenu.module.css';
import React from "react";
import { Link } from "react-router-dom";
import { FaAddressBook } from 'react-icons/fa';
import { IoHome } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaListAlt } from "react-icons/fa";
import { GiTalk } from "react-icons/gi";
import { HiMenuAlt3 } from "react-icons/hi";
import {ImExit} from "react-icons/im";

export const SideMenu = ({ open, setOpen }) => {

  const menus = [
    { name: "Home", link: "/", icon: IoHome },
    { name: "Calendar", link: "calendar", icon: FaCalendarDays },
    { name: "Address", link: "address", type:"사원 주소록", icon: FaAddressBook },
    { name: "Approval", link: "approval", icon: LiaClipboardListSolid },
    { name: "Community", link: "community", icon: FaListAlt },
    { name: "Messenger", link: "chat", icon: GiTalk },
  ]

  const handleSideToggle = () => {
    setOpen(prev => {
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
          <HiMenuAlt3 size={30} className={styles.icons} onClick={handleSideToggle} />
        </div>
        <div className={styles.menus}>
          {
            menus.map((menu, i) => {
              return (
                <Link to={menu?.link} state={{type:menu?.type}} key={i} className={styles.menuLink}>
                  <div>
                    {React.createElement(menu?.icon, { size: "30", color: "white" })}
                  </div>
                  <h3 className={open ? styles.menuTitle : styles.menuTitleAction}>{menu?.name}</h3>
                </Link>
              );
            })
          }
        </div>
      </div>
    </div>
  )
}