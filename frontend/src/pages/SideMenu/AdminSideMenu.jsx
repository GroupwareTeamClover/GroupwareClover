import styles from './AdminSideMenu.module.css';
import {Link, useNavigate} from "react-router-dom";
import { FaAddressBook } from 'react-icons/fa';
import { IoHome } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaListAlt } from "react-icons/fa";
import { GiTalk } from "react-icons/gi";
import { useCallback, useEffect, useState } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import React from "react";


export const AdminSideMenu = ({ open, setOpen }) => {

  const navi = useNavigate();

   // useCallback 훅을 사용하여 handleNavigation 메모이제이션
   const handleNavigation = (path, type) => {
    navi(path, { state: { type } });
  };

  const menus = [
    { name: "Home", path: "/", type: "Home", icon: IoHome },
    { name: "조직관리", path: "member", type: "member", icon: FaCalendarDays, submenus: [
        { name: "통합 사원 목록", path: "member", type: "통합사원목록" },
        { name: "가입 승인 목록", path: "member/addmem", type: "가입승인목록" },
        { name: "삭제 사원 목록", path: "member/delmem", type: "삭제사원목록" }
      ]
    },
    { name: "팝업공지관리", path: "popup", type: "popup", icon: FaCalendarDays, submenus: [
        { name: "공지글 목록", path: "popup", type: "공지글목록" },
        { name: "공지 작성하기", path: "popup/write", type: "공지작성하기" }
      ]
    },
    { name: "게시글관리", path: "/community", type: "community", icon: LiaClipboardListSolid },
    { name: "보안관리", path: "log", type: "log", icon: FaListAlt }
  ];

  const [dropdown, setDropdown] = useState({
    member: false,
    popup: false
  });

  const [selectedMenu, setSelectedMenu] = useState('');

  useEffect(() => {
    if (!open) {
      const firstSubmenu = menus.find(menu => menu.submenus)?.submenus?.[0];
      if (firstSubmenu) {
        handleNavigation(firstSubmenu.path, firstSubmenu.type);
      }
    } else {
      setDropdown(prevState => ({ ...prevState, member: false, popup: false }));
    }
  }, [open]);

  const handleMenuClick = (menu, path, type) => {
    setSelectedMenu(menu);
    handleNavigation(path, type);
  };

  // const toggleDropdown = (menu) => {
  //   if(!open){
  //     const firstSubmenu = menus.find(m=>m.name === menu)?.submenus?.[0];
  //     console.log(firstSubmenu);
  //     if(firstSubmenu){
  //       handleMenuClick(firstSubmenu.name, firstSubmenu.path, firstSubmenu.type);
  //     }
  //   } else{
  //       setDropdown(prevState => ({
  //         ...prevState,
  //         [menu]: !prevState[menu],
  //   }));
  //   }
  // };

  const toggleDropdown = (menu) => {
    if (!open) {
      const firstSubmenu = menus.find(m => m.name === menu)?.submenus?.[0];
      if (firstSubmenu) {
        handleMenuClick(firstSubmenu.name, firstSubmenu.path, firstSubmenu.type);
      }
    } else {
      setDropdown(prevState => ({
        ...prevState,
        [menu]: !prevState[menu]
      }));
    }
  };

  const handleSideToggle = () => {
    setOpen(prev => {
      const sideState = !prev;
      if (sideState) localStorage.setItem("sidebar", "true");
      else localStorage.setItem("sidebar", "false");
      setDropdown({member:false, popup:false})
      
      return sideState;
    });
  };

  return (
    <div className={styles.container}>
      <div className={open ? styles.sideFull : styles.sideShort}>
        <div className={styles.toggle}>
          <HiMenuAlt3 size={30} className={styles.icons} onClick={handleSideToggle} />
        </div>
        <div className={styles.menus}>
          {
            menus.map((menu, i) => {
              return(
                <div key={i}>
                <Link to={menu?.link} key={i} className={styles.menuLink} onClick={() => menu.submenus ? toggleDropdown(menu.type) : handleMenuClick(menu.type, menu.path, menu.type)}
                  style={{ color: selectedMenu === menu.type ? 'orange' : 'black' }}>
                  <div>
                    {React.createElement(menu.icon, { size: "30", color: "white" })}
                  </div>
                  <h3 className={open ? styles.menuTitle : styles.menuTitleAction}>{menu?.name}</h3>
                </Link>
                {
                  menu.submenus && dropdown[menu.type] && (
                    <div className={styles.dropdown}>
                      {menu.submenus.map((submenu, j) => (
                        <Link to={submenu.path} key={j} className={styles.menuLink} onClick={() => handleMenuClick(submenu.type, submenu.path, submenu.type)}
                          style={{ color: selectedMenu === submenu.type ? 'orange' : 'white' }}>
                          <div className={styles.submenuTitle}>{submenu.name}</div>
                        </Link>
                      ))}
                    </div>
                  )} 
                  </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};