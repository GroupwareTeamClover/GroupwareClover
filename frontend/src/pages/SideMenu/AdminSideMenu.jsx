import styles from './AdminSideMenu.module.css';
import { useNavigate, useLocation } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaExclamationCircle, FaUserTie } from 'react-icons/fa';
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaHistory } from 'react-icons/fa';
import { HiMenuAlt3 } from "react-icons/hi";
import React, { useEffect, useMemo, useState } from 'react';
import { GiTalk } from 'react-icons/gi';

export const AdminSideMenu = () => {
  // 사이드바 상태 초기화
  const [open, setOpen] = useState(() => {
    return localStorage.getItem("sidebar") === "true";
  });

  // 드롭다운 상태 초기화
  const [dropdown, setDropdown] = useState(() => {
    const savedDropdown = localStorage.getItem("dropdown");
    return savedDropdown ? JSON.parse(savedDropdown) : { member: false, popup: false };
  });

  const [selectedMenu, setSelectedMenu] = useState('');
  const [selectedParentMenu, setSelectedParentMenu] = useState('');

  const menus = useMemo(() => [
    { name: "Home", link: "/", type: "Home", icon: IoHome },
    { 
      name: "조직관리", link: "/member", type: "통합사원목록", icon: FaUserTie, 
      submenus: [
        { name: "통합 사원 목록", link: "/member", type: "통합 사원 목록" },
        { name: "가입 승인 목록", link: "/member/addmem", type: "가입 승인 목록" }
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

  const handleMenuClick = (link, type, parentType) => {
    setSelectedMenu(type);
    setSelectedParentMenu(parentType);
    navi(link, { state: { type } });
  };

  const handleSideToggle = () => {
    setOpen(prev => {
      const newState = !prev;
      localStorage.setItem("sidebar", newState ? "true" : "false");
      return newState;
    });
  };

  const toggleDropdown = (menuType) => {
    setDropdown(prevState => {
      const newState = { ...prevState, [menuType]: !prevState[menuType] };
      localStorage.setItem("dropdown", JSON.stringify(newState));
      return newState;
    });
  };

  useEffect(() => {
    if (!open) {
      setDropdown(prev => {
        const newState = { ...prev, member: false, popup: false };
        localStorage.setItem("dropdown", JSON.stringify(newState));
        return newState;
      });
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
      localStorage.setItem("dropdown", JSON.stringify({
        ...dropdown,
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
                onClick={() => menu.submenus ? toggleDropdown(menu.type) : handleMenuClick(menu.link, menu.type, menu.type)} 
              >
                <div>{React.createElement(menu.icon, { size: "30" })}</div>
                {open && <h3 className={styles.menuTitle}>{menu.name}</h3>}
              </div>
              {menu.submenus && dropdown[menu.type] && (
                <div className={styles.dropdown}>
                  {menu.submenus.map((submenu, j) => (
                    <div 
                      key={j} 
                      className={styles.menuLink} 
                      onClick={() => handleMenuClick(submenu.link, submenu.type, menu.type)}
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
