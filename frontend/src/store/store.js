import { create } from 'zustand';

export const useMemberStore = create(set => ({
  sign: false,
  setSign: param => set({ sign: param }),
  userSession: null,
  setUserSession: param => set({ userSssion: param })
}));

export const useBoardStore = create(set => ({
  allBoardList: [],
  setAllBoardList : (param) => set({allBoardList : param}),
  addAllBoardList: (param) => set(prev => ({ allBoardList: [...prev.allBoardList, param] })),
  modifyAllBoardList: (param) => set(prev => ({
    allBoardList: prev.allBoardList.map(dto =>
      dto.boardlistSeq === param.boardlistSeq ? {
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
      dto.boardlistSeq === param.boardlistSeq ? {
        boardlistSeq: param.boardlistSeq, boardlistName: param.boardlistName,
        boardlistType: param.boardlistType, boardlistActive: param.boardlistActive
      } : dto
    )
  })),
  delGroupBoardList: (seq) => set(prev => ({
    groupBoardList: prev.groupBoardList.filter(dto => (dto.boardlistSeq != seq))
  }))
}));