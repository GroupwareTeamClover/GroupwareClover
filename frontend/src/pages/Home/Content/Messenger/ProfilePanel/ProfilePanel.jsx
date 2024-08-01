import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ProfilePanel.module.css';
import { BaseUrl } from '../../../../../commons/config';
import { useMemberStore } from '../../../../../store/store';

const ProfilePanel = () => {
  const [profile, setProfile] = useState(null);
  const { sessionData } = useMemberStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BaseUrl()}/chat/profile`);
        setProfile(response.data);
      } catch (error) {
        console.error('프로필 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.profilePanel}>
      <div className={styles.profileHeader}>
        <div className={styles.profilePicture}>
          <img src={profile.EMPAVATAR || sessionData.empAvatar} alt={profile.EMPNAME} />
        </div>
      </div>
      <div className={styles.profileName}>        
          <h2>{profile.EMPNAME}</h2>
      </div>
      <div className={styles.profileName}>        
          <p>직급 : {profile.ROLENAME}</p>
      </div>
      <div className={styles.profileName}>        
          <p>{profile.EMPEMAIL}</p>
      </div>
      
      
      <button className={styles.chatButton}>대화하기</button>
      <div className={styles.profileDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>부서</span>
          <span className={styles.detailValue}>{profile.DEPTNAME}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>직책/부서</span>
          <span className={styles.detailValue}>{profile.DEPTNAME}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>직급</span>
          <span className={styles.detailValue}>{profile.ROLENAME}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>직통전화</span>
          <span className={styles.detailValue}>{profile.EMPTEL}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>핸드폰번호</span>
          <span className={styles.detailValue}>{profile.EMPTEL}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;