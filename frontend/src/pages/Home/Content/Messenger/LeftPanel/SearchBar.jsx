import React from 'react';
import styles from '../Messenger.module.css';

const SearchBar = () => {
  return (
    <div className={styles.searchBar}>
      <input type="text" placeholder="대화방, 참여자 검색" />
    </div>
  );
};

export default SearchBar;