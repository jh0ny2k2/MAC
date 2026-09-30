import { create } from 'zustand';

interface TutorialState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useTutorialStore = create<TutorialState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
