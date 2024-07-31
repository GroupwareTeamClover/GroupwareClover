import styles from './AdminSideMenu.module.css';
import { useNavigate } from "react-router-dom";
import { FaAddressBook } from 'react-icons/fa';
import { IoHome } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaListAlt } from "react-icons/fa";
import { GiTalk } from "react-icons/gi";
import { useEffect, useState } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import React from "react";

export const AdminSideMenu = ({ open, setOpen }) => {

  const menus = [
    { name: "Home", link: "/", type: "Home", icon: IoHome },
    { name: "조직관리", link: "member", type: "통합사원목록", icon: FaCalendarDays, 
      submenus: [
        { name: "통합 사원 목록", link: "member", type: "통합사원목록" },
        { name: "가입 승인 목록", link: "member/addmem", type: "가입승인목록" },
        { name: "삭제 사원 목록", link: "member/delmem", type: "삭제사원목록" }
      ]
    },
    { name: "팝업공지관리", link: "popup", type: "popup", icon: FaCalendarDays, 
      submenus: [
        { name: "공지글 목록", link: "popup", type: "공지글목록" },
        { name: "공지 작성하기", link: "popup/write", type: "공지작성하기" }
      ]
    },
    { name: "게시글관리", link: "/community", type: "community", icon: LiaClipboardListSolid },
    { name: "보안관리", link: "log", type: "log", icon: FaListAlt }
  ];

  const handleSideToggle = () => {
    setOpen(prev => {
      const sideState = !prev;
      if (sideState) {localStorage.setItem("sidebar", "true");}
      else {localStorage.setItem("sidebar", "false");
       
        }  
      setDropdown({ member: false, popup: false });      
      return sideState;
    });
  };

  const navi = useNavigate();

  const handleNavigation = (link, type) => {
    navi(link, { state: { type } });
  };

  const [dropdown, setDropdown] = useState({
    member: false,
    popup: false
  });

  const [selectedMenu, setSelectedMenu] = useState('');

  const handleMenuClick = (link, type) => {
    setSelectedMenu(type);
    console.log(type);
    handleNavigation(link, type);
  };

  const toggleDropdown = (menu) => {
    if (!open) {
      const firstSubmenu = menus.find(m => m.name === menu)?.submenus?.[0];
      if (firstSubmenu) {
        handleMenuClick(firstSubmenu.link, firstSubmenu.type);
      }
    } else {
      setDropdown(prevState => ({
        ...prevState,
        [menu]: !prevState[menu]
      }));
    }
  };

  useEffect(() => {
    if (open) {
      setDropdown(prevState => ({ ...prevState, member: false, popup: false }));
    }
  }, [open]);

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
                <div key={i}>
                  {open ? (
                    <div className={styles.menuLink} onClick={() => menu.submenus ? toggleDropdown(menu.type) : handleMenuClick(menu.link, menu.type)} >
                      <div>
                        {React.createElement(menu.icon, { size: "30", color: "white" })}
                      </div>
                      <h3 className={styles.menuTitle}>{menu?.name}</h3>
                    </div>
                  ) : (
                    <div className={styles.menuLink} onClick={() => handleMenuClick(menu.link, menu.type)} >
                      <div>
                        {React.createElement(menu.icon, { size: "30", color: "white" })}
                      </div>
                      <h3 className={open ? styles.menuTitle : styles.menuTitleAction}>{menu?.name}</h3>
                    </div>
                  )}

                  {menu.submenus && dropdown[menu.type] && (
                    <div className={styles.dropdown}>
                      {menu.submenus.map((submenu, j) => (
                        <div key={j} className={styles.menuLink} onClick={() => handleMenuClick(submenu.link, submenu.type)}
                          style={{ color: selectedMenu === submenu.type ? 'orange' : 'white' }}
                          >
                          <div className={styles.submenuTitle}>{submenu.name}</div>
                        </div>
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
