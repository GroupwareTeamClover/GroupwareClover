import { create } from 'zustand';

export const useMemberStore = create(set => ({
  sign: false,
  setSign: param => set({sign: param}),
  sessionData: {
    empSeq: "",
    empId: "",
    empName: "",
    empAvatar: "",
    empDeptCode: "",
    empRoleCode: ""
  },
  setSessionData: param => set({ sessionData : param}),
  setAvatar : param => set(prev => ({ sessionData : { ...prev.sessionData, ...param }})),
  admin: false,
  setAdmin: param => set({admin: param})
}));

export const useBoardStore = create(set => ({
  allBoardList: [],
  setAllBoardList : (param) => set({allBoardList : param}),
  addAllBoardList: (param) => set(prev => ({ allBoardList: [...prev.allBoardList, param] })),
  modifyAllBoardList: (param) => set(prev => ({
    allBoardList: prev.allBoardList.map(dto =>
      dto.boardlistSeq == param.boardlistSeq ? {
        boardlistSeq: param.boardlistSeq, boardlistName: param.boardlistName,
        boardlistType: param.boardlistType, boardlistActive: param.boardlistActive
      } : dto
    )
  })),
  delAllBoardList: (seq) => set(prev => ({
    allBoardList: prev.allBoardList.filter(dto => (dto.boardlistSeq != seq))
  })),

  groupBoardList: [],
  setGroupBoardList : (param) => set({groupBoardList : param}),
  addGroupBoardList: (param) => set(prev => ({ groupBoardList: [...prev.groupBoardList, param] })),
  modifyGroupBoardList: (param) => set(prev => ({
    groupBoardList: prev.groupBoardList.map(dto =>
      dto.boardlistSeq == param.boardlistSeq ? {
        boardlistSeq: param.boardlistSeq, boardlistName: param.boardlistName,
        boardlistType: param.boardlistType, boardlistActive: param.boardlistActive
      } : dto
    )
  })),
  delGroupBoardList: (seq) => set(prev => ({
    groupBoardList: prev.groupBoardList.filter(dto => (dto.boardlistSeq != seq))
  }))
}));




// 모달에서 사원 정보 수정완료시 데이터 바로 적용하게.
export const useMemStore = create(set=>({
  storemembers:false,
  setstoremembers:(storemembers)=>set({storemembers:storemembers})
}));
// checkbox 체크된거 reset하려고
