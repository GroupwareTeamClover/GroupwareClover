import { create } from 'zustand';

export const useScheduleStore = create(set => ({
  // 전체 스케줄 리스트
  scheduleList: [],
  setScheduleList: param => set({ scheduleList : param }),

  // 선택된 스케줄 리스트
  scheduleSelectList: [],
  setScheduleSelectList: param => set({ scheduleSelectList : param }),

  // 선택된 스케줄
  scheduleDetail: {},
  setScheduleDetail: param => set({ scheduleDetail : param }),

  // 선택된 날짜
  scheduleDay: "",
  setScheduleDay: param => set({ scheduleDay: param }),
}));