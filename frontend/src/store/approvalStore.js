import { create } from 'zustand';


export const useApprovalStore = create((set) => ({
    //selectedDocCode({ name: '', children: { name: '', period: 0, detailcode: 0 } });
    //selectedEmpInfo({ apvchoice: [], refchoice: [], viechoice: [], recchoice: []});
  
    //modal 원본
    selectedDocCode: { name: '', children: { name: '', period: 0, detailcode: 0 } },
    setSelectedDocCode: (deptTree)=> {
        set({selectedDocCode : deptTree});
        // set({copySelectedDocCode: deptTree});
        return deptTree;
    },

    selectedEmpInfo: { apvchoice: [], refchoice: [], viechoice: [], recchoice: [] },
    setSelectedEmpInfo: (updateFn) => set((state) => {
        const updatedEmpInfo = updateFn(state.selectedEmpInfo);
        // const updatedCopyEmpInfo = updateFn(state.copySelectedEmpInfo);
        return {
            selectedEmpInfo: updatedEmpInfo
            // copySelectedEmpInfo: updatedEmpInfo
        };
    }),

    // 상태 초기화 함수 추가
    resetSelectedEmpInfo: () => set({
        selectedEmpInfo: { apvchoice: [], refchoice: [], viechoice: [], recchoice: [] }
    }),
    resetSelectedDocCode: () => set({
        selectedDocCode: { name: '', children: { name: '', period: 0, detailcode: 0 } }
    }),

    cloneDocCode: {},
    setCloneDocCode: (param)=>{ set({cloneDocCode: param })},
    cloneEmpInfo: [],
    setCloneEmpInfo: (param)=>{ set({cloneEmpInfo: param})}
    


}))


    //혹시 몰라서...modal copy
    // copySelectedDocCode: { name: '', children: { name: '', period: 0, detailcode: 0 } },
    // setCopySelectedDocCode: (deptTree)=> set({copySelectedDocCode : deptTree}),
    
    // copySelectedEmpInfo: { apvchoice: [], refchoice: [], viechoice: [], recchoice: []},
    // setCopySelectedEmpInfo: (updateFn) => set((state) => ({
    //     copySelectedEmpInfo: updateFn(state.copySelectedEmpInfo)
    // }))