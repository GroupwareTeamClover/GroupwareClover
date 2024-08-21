import styles from './AdminSideMenu.module.css';
import { useNavigate, useLocation } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaExclamationCircle, FaUserTie } from 'react-icons/fa';
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaHistory } from 'react-icons/fa';
import { HiMenuAlt3 } from "react-icons/hi";
import React, { useEffect, useMemo, useState } from 'react';
import { GiTalk } from 'react-icons/gi';
import { FaCalendarDays } from 'react-icons/fa6';

export const AdminSideMenu = () => {
  const menus = useMemo(() => [
    { name: "Dash", link: "/", type: "Dash", icon: IoHome },
    { name: "Calendar", link: "/calendar", type: "Calendar", icon: FaCalendarDays },
    { 
      name: "조직관리", link: "/member", type: "통합사원목록", icon: FaUserTie, 
      submenus: [
        { name: "조직도", link: "/member/deptmap", type: "조직도" },
        { name: "통합 사원 목록", link: "/member", type: "통합 사원 목록" },
        { name: "가입 승인 목록", link: "/member/addmem", type: "가입 승인 목록" },
        { name: "통합 근태 목록", link: "/member/attend", type: "통합 근태 목록" },
      ]
    },
    { 
      name: "팝업공지관리", link: "/popup", type: "팝업공지글 목록", icon: FaExclamationCircle, 
      submenus: [
        { name: "팝업공지글 목록", link: "/popup", type: "팝업공지글 목록" },
        { name: "팝업공지 작성하기", link: "/popup/write", type: "팝업공지 작성하기" }
      ]
    },
    { name: "게시글관리", link: "/community", type: "community", icon: LiaClipboardListSolid },
    { name: "접속로그관리", link: "/log", type: "접속 로그 관리", icon: FaHistory },
    { name: "Messenger", link: "/chat", type: "Messenger", icon: GiTalk },
  ], []);

  const navi = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState === null ? true : JSON.parse(savedState);
  });

  const [dropdown, setDropdown] = useState(() => {
    const savedDropdownState = localStorage.getItem('dropdownState');
    return savedDropdownState ? JSON.parse(savedDropdownState) : { member: false, popup: false };
  });

  const [selectedMenu, setSelectedMenu] = useState('');

  const handleMenuClick = (link, type) => {
    setSelectedMenu(type);
    navi(link, { state: { type } });
  };

  const handleSideToggle = () => {
    setOpen(prev => {
      const newState = !prev;
      if (!newState) {
        setDropdown({ member: false, popup: false }); // 사이드바가 닫히면 드롭다운도 닫음
      }
      return newState;
    });
  };

  useEffect(() => {
    localStorage.setItem('sidebarOpen', open);
  }, [open]);

  useEffect(() => {
    localStorage.setItem('dropdownState', JSON.stringify(dropdown));
  }, [dropdown]);

  const toggleDropdown = (menuType) => {
    if (!open) {
      setOpen(true); // 사이드바가 닫혀있으면 열기
    }
    setDropdown(prev => ({ ...prev, [menuType]: !prev[menuType] }));
  };

  useEffect(() => {
    if (!open) {
      setDropdown({ member: false, popup: false }); // 사이드바가 닫히면 드롭다운도 닫음
    }
  }, [open]);

  useEffect(() => {
    const path = location.pathname;
    let newSelectedMenu = '';
    let newDropdownState = { member: false, popup: false };

    menus.forEach(menu => {
      if (path.startsWith(menu.link)) {
        newSelectedMenu = menu.type;
        if (menu.submenus) {
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
      setDropdown(prev => ({
        ...prev,
        ...newDropdownState
      }));
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
                onClick={() => menu.submenus ? toggleDropdown(menu.type) : handleMenuClick(menu.link, menu.type)} 
              >
                <div>{React.createElement(menu.icon, { size: "30" })}</div>
                {open && <h3 className={styles.menuTitle}>{menu.name}</h3>}
              </div>
              {menu.submenus && (open ? dropdown[menu.type] : false) && (
                <div className={open ? styles.dropdown : styles.dropdownHidden}>
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
