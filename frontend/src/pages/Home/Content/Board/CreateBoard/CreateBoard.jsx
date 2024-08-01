import { useEffect, useState } from 'react';
import styles from './CreateBoard.module.css';
import { FaPlusSquare } from "react-icons/fa";
import AddMemberModal from './AddMemberModal/AddMemberModal';
import axios from 'axios';
import AddMemberCheckBox from './AddMemberModal/AddMemberCheckBox/AddMemberCheckBox';
import AddMemberCheckBoxGroup from './AddMemberModal/AddMemberCheckBox/AddMemberCheckBoxGroup';
import { useNavigate } from 'react-router';
import { BaseUrl } from '../../../../../commons/config';
import { useBoardStore, useMemberStore } from '../../../../../store/store';

const CreateBoard = () => {

    const { addAllBoardList, addGroupBoardList } = useBoardStore();
    const { admin } = useMemberStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        if (boardType == 'A') {
            alert("그룹 게시판만 접근을 허용할 사용자를 추가할 수 있습니다.");
        } else {
            setAddMembers(addedMembers);
            setIsModalOpen(true);
        }
    }
    const closeModal = () => {
        setAddMembers([]);
        setIsModalOpen(false);
    }

    const [members, setMembers] = useState([]);
    const [depts, setDepts] = useState([]);
    const [addMembers, setAddMembers] = useState([]);
    const handleAddMember = () => {
        setAddedMembers(addMembers);
        setIsModalOpen(false);
    }

    // 사용자 추가
    const [addedMembers, setAddedMembers] = useState([]);
    const handleDelAddedMember = (e) => {
        const targetSeq = e.target.getAttribute('data-seq');
        setAddedMembers((prev) => prev.filter(member => member.EMP_SEQ != targetSeq));
        setAddMembers((prev) => prev.filter(member => member.EMP_SEQ != targetSeq));
    }

    // 제목
    const [title, setTitle] = useState('');
    const handleChange = (e) => {
        setTitle(e.target.value);
    }

    // 유형
    const [boardType, setBoardType] = useState('A');
    const handleType = (e) => {
        setBoardType(e.target.value);
        setAddMembers([]);
        setAddedMembers([]);
    }

    // 활성화 여부
    const [boardActive, setBoardActive] = useState('T');
    const handleActive = (e) => {
        setBoardActive(e.target.value);
    }

    useEffect(() => {
        axios.get(`${BaseUrl()}/boardlist/members`).then((resp) => {
            setMembers(resp.data);
        });
        axios.get(`${BaseUrl()}/boardlist/depts`).then((resp) => {
            setDepts(resp.data);
        });
    }, []);

    const navi = useNavigate();
    const handleCancel = () => {
        let isCancel = window.confirm("게시판 생성을 취소하시겠습니까?");
        if (isCancel) {
            navi("/community");
        }
    }

    const handleCreate = () => {
        axios.get(`${BaseUrl()}/boardlist/title`, { params: { title: title.trim() } }).then((resp) => {
            if (title.trim() == '') {
                alert("게시판 제목을 입력해주세요!");
            } else if (resp.data) {
                alert("이미 존재하는 게시판 이름입니다!");
            } else if (boardType === 'G' && addedMembers.length === 0) {
                alert("접근을 허용할 인원을 최소 1명 이상 추가해주세요!");
            } else {
                axios.post(`${BaseUrl()}/boardlist`, {
                    title: title,
                    type: boardType,
                    members: addedMembers.map(member => member.EMP_SEQ),
                    active: boardActive
                }).then((resp) => {
                    if (resp.status === 200) {
                        let addedData = { boardlistSeq: resp.data, boardlistName: title, boardlistType: boardType, boardlistActive: boardActive };
                        if (boardActive === 'T') {
                            (boardType === 'A') ? addAllBoardList(addedData) : addGroupBoardList(addedData);
                        }
                        alert("게시판이 생성되었습니다!");
                        navi("/community/board", { state: addedData });
                    }
                });
            }
        });
    }

    return !admin ? <div className={styles.container}>관리자 전용 페이지입니다.</div> : (
        <div className={styles.container}>
            <div className={styles.header}>게시판 만들기</div>
            <div className={styles.titleBox}>
                <div className={styles.titleLetter}>게시판이름</div>
                <input type="text" name="title" onChange={handleChange} value={title} maxLength={10} placeholder='최대 10자까지 작성 가능' />
            </div>
            <div className={styles.typeBox}>
                <div className={styles.typeLetter}>게시판유형</div>
                <label htmlFor="boardtype_all"><input type="radio" name="type" value="A" id="boardtype_all" onChange={handleType} checked={boardType == 'A'} />전사 게시판</label>
                <label htmlFor="boardtype_group"><input type="radio" name="type" value="G" id="boardtype_group" onChange={handleType} checked={boardType == 'G'} />그룹 게시판</label>
            </div>
            <div className={styles.memberBox}>
                <div className={styles.memberLetter}>
                    사용자 추가
                    <div className={styles.memberLetterCaution}>주의 : 전사 게시판 선택 시 그룹게시판 접근 허용자 목록은 모두 선택 해제됩니다.</div>
                </div>
                <div className={styles.memberBoxLayout}>
                    <div className={styles.addMemberBox}>
                        <div className={styles.addMemberBtn} onClick={openModal}>
                            <FaPlusSquare /><div className={styles.addMemberLetter}>추가하기</div>
                        </div>
                        <div className={styles.addMemberList}>
                            {
                                addedMembers.map((member, i) =>
                                    <div key={i} className={styles.eachAdded}>
                                        <div>{member.EMP_NAME} / {member.ROLE_NAME} / {member.DEPT_NAME} </div>
                                        <div className={styles.delBtn} onClick={handleDelAddedMember} data-seq={member.EMP_SEQ}>X</div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <AddMemberModal isOpen={isModalOpen} onClose={closeModal}>
                        <div className={styles.modalHeader}>사용자 추가</div>
                        <div className={styles.modalContent}>
                            <AddMemberCheckBoxGroup values={addMembers} onChange={setAddMembers}>
                                {depts.map((dept, i) => (
                                    <div key={i}>
                                        <h2>{dept}</h2>
                                        {members.filter(member => member.DEPT_NAME === dept).map((member, j) => (
                                            <AddMemberCheckBox key={`${i}-${j}`} value={member}>
                                                {member.EMP_NAME} / {member.ROLE_NAME}
                                            </AddMemberCheckBox>
                                        ))}
                                    </div>
                                ))}
                            </AddMemberCheckBoxGroup>
                        </div>
                        <div className={styles.buttonBox}>
                            <button onClick={handleAddMember}>추가</button>
                        </div>
                    </AddMemberModal>
                </div>
            </div>
            <div className={styles.activeBox}>
                <div className={styles.activeLetter}>활성화 여부</div>
                <label htmlFor="boardactive_true"><input type="radio" name="active" value="T" id="boardactive_true" onChange={handleActive} checked={boardActive == 'T'} />활성화</label>
                <label htmlFor="boardactive_false"><input type="radio" name="active" value="F" id="boardactive_false" onChange={handleActive} checked={boardActive == 'F'} />비활성화</label>
            </div>
            <div className={styles.mainButtonBox}>
                <button className={styles.cancelButton} onClick={handleCancel}>취소</button>
                <button className={styles.createButton} onClick={handleCreate}>만들기</button>
            </div>
        </div>
    );
}

export default CreateBoard;