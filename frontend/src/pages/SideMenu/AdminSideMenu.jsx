import styles from './AdminSideMenu.module.css';
import { useNavigate, useLocation } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaExclamationCircle } from 'react-icons/fa';
import { FaUserTie } from 'react-icons/fa';
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaListAlt } from "react-icons/fa";
import { FaHistory } from 'react-icons/fa';

import { HiMenuAlt3 } from "react-icons/hi";
import React, { useEffect, useMemo, useState } from 'react';

export const AdminSideMenu = ({ open, setOpen }) => {
 // 메모이제이션 : 함수의 실행 결과를 캐시(cache)에 저장해두고, 동일한 입력값으로 함수가 다시 호출될때 캐시된 결과를 재사용하는 최적화 기법. 
 //               함수의 계산 결과를 저장해두기 때문에, 불필요한 연산을 피할 수 있어 성능 향상!! 
 //               useMemo, useCallback 훅을 사용해서 컴포넌트가 불필요하게 다시 렌더링되거나 함수가 재정의 되는 것을 방지한다. 
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
    { name: "접속로그관리", link: "/log", type: "접속 로그 관리", icon: FaHistory }
  ], []);


  const navi = useNavigate();
  const location = useLocation();

  const [dropdown, setDropdown] = useState({
    member: false,
    popup: false
  });
  const [selectedMenu, setSelectedMenu] = useState('');
  const [selectedParentMenu, setSelectedParentMenu] = useState('');
  const handleMenuClick = (link, type, parentType) => {
    setSelectedMenu(type);
    setSelectedParentMenu(parentType);
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

 // useEffect로 추가적인 드롭다운 상태 관리
  useEffect(() => {
    if (!open) {
      // 사이드바가 닫혀 있으면 드롭다운을 모두 닫음
      setDropdown({ member: false, popup: false });
    }
  }, [open]);

  const toggleDropdown = (menuType, firstSubmenu) => {
    if (!open) {
      setOpen(true);
      //handleMenuClick(firstSubmenu.link, firstSubmenu.type);
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
    },[]);

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
              <div className={styles.menuLink} onClick={() => menu.submenus ? toggleDropdown(menu.type, menu.submenus[0]) : handleMenuClick(menu.link, menu.type, menu.type)}
                style={{ color: selectedMenu === menu.type ? 'orange' : 'black' }} >
                    <div>{React.createElement(menu.icon, { size: "30", color: "white" })}</div>
                    {open && <h3 className={styles.menuTitle} style={{ color: selectedMenu === menu.type ? 'orange' : 'white' }}>{menu.name}</h3>}
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
