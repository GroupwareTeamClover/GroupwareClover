import { create } from 'zustand';

export const useMemberStore = create(set => ({
  sign: false,
  setSign: param => set({sign: param}),
  userSession: null,
  setUserSession: param => set({ userSssion : param}),
  admin: false,
  setAdmin: param => set({admin: param})
}));