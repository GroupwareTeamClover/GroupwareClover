import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../Messenger.module.css';
import { BaseUrl } from '../../../../../commons/config';

const ProfilePanel = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BaseUrl()}/chat/profile`);
        console.log(response.data);
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
      <div className={styles.profilePicture}>
        <img src={profile.empAvatar || '/default-avatar.png'} alt={profile.empName} />
      </div>
      <div className={styles.profileInfo}>
        <h2>{profile.empName}</h2>
        <p>{profile.roleName}</p>
        <p>{profile.empEmail}</p>
        <p>{profile.deptName}</p>
        <p>{profile.empTel}</p>
        <p>{profile.empBirth}</p>
        <button>대화하기</button>
      </div>
    </div>
  );
};

export default ProfilePanel;
