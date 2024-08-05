import styles from './AdminSideMenu.module.css';
import { useNavigate, useLocation } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaListAlt } from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import React, { useEffect, useState } from 'react';

export const AdminSideMenu = ({ open, setOpen }) => {
  const menus = [
    { name: "Home", link: "/", type: "Home", icon: IoHome },
    { 
      name: "조직관리", link: "/member", type: "통합사원목록", icon: FaCalendarDays, 
      submenus: [
        { name: "통합 사원 목록", link: "/member", type: "통합사원목록" },
        { name: "가입 승인 목록", link: "/member/addmem", type: "가입승인목록" }
      ]
    },
    { 
      name: "팝업공지관리", link: "/popup", type: "공지글목록", icon: FaCalendarDays, 
      submenus: [
        { name: "공지글 목록", link: "/popup", type: "공지글목록" },
        { name: "공지 작성하기", link: "/popup/write", type: "공지작성하기" }
      ]
    },
    { name: "게시글관리", link: "/community", type: "community", icon: LiaClipboardListSolid },
    { name: "보안관리", link: "/log", type: "log", icon: FaListAlt }
  ];

  const navi = useNavigate();
  const location = useLocation();

  const [dropdown, setDropdown] = useState({
    member: false,
    popup: false
  });
  const [selectedMenu, setSelectedMenu] = useState('');
  const handleMenuClick = (link, type) => {
    setSelectedMenu(type);
    navi(link, { state: { type } });
  };


  const handleSideToggle = () => {
    setOpen(prev => {
      const sideState = !prev;

      if (!sideState) {
        setDropdown({ member: false, popup: false });
      }

      localStorage.setItem("sidebar", sideState ? "true" : "false");
      return sideState;
    });
  };

 

  const toggleDropdown = (menuType, firstSubmenu) => {
    if (!open) {
      setOpen(true);
      handleMenuClick(firstSubmenu.link, firstSubmenu.type);
      setDropdown(prev => ({ ...prev, [menuType]: true }));
    } else {
      setDropdown(prevState => ({
        ...prevState,
        [menuType]: !prevState[menuType]
      }));
    }
  };

  useEffect(() => {
    const path = location.pathname;

    let newSelectedMenu = '';
    let newDropdownState = { member: false, popup: false };

    menus.forEach(menu => {
      if (path.startsWith(menu.link)) {
        newSelectedMenu = menu.type;

        if (menu.submenus) {
          // 드롭다운이 열려야 할 메뉴의 서브 메뉴를 확인
          const matchedSubmenu = menu.submenus.find(submenu => path === submenu.link);
          if (matchedSubmenu) {
            newSelectedMenu = matchedSubmenu.type;
          }

          newDropdownState = {
            ...newDropdownState,
            [menu.type]: true
          };
        }
      }
    });

    if (newSelectedMenu !== selectedMenu) {
      setSelectedMenu(newSelectedMenu);
      setDropdown(newDropdownState);
    }
  }, [location.pathname, selectedMenu, menus]);

  return (
    <div className={styles.container}>
      <div className={open ? styles.sideFull : styles.sideShort}>
        <div className={styles.toggle}>
          <HiMenuAlt3 size={30} className={styles.icons} onClick={handleSideToggle} />
        </div>
        <div className={styles.menus}>
          {menus.map((menu, i) => (
            <div key={i}>
              <div 
                className={styles.menuLink} 
                onClick={() => menu.submenus 
                  ? toggleDropdown(menu.type, menu.submenus[0]) 
                  : handleMenuClick(menu.link, menu.type)}
                style={{ color: selectedMenu === menu.type ? 'orange' : 'black' }}
              >
                <div>{React.createElement(menu.icon, { size: "30", color: "white" })}</div>
                {open && <h3 className={styles.menuTitle}>{menu.name}</h3>}
              </div>
              {menu.submenus && dropdown[menu.type] && (
                <div className={styles.dropdown}>
                  {menu.submenus.map((submenu, j) => (
                    <div 
                      key={j} 
                      className={styles.menuLink} 
                      onClick={() => handleMenuClick(submenu.link, submenu.type)}
                      style={{ color: selectedMenu === submenu.type ? 'orange' : 'white' }}
                    >
                      <div className={styles.submenuTitle}>{submenu.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
