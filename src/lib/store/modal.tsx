import create from 'zustand';

interface ModalState {
  modalOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalOpen: false,
  setOpen: () => set({ modalOpen: true }),
  setClose: () => set({ modalOpen: false }),
}));
