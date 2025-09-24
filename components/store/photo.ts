import { create } from "zustand";

type SelectedPhotoState = {
  photo: string | null;
  set: (photo: string) => void;
};

export const useSelectedPhotoStore = create<SelectedPhotoState>((set) => ({
  photo: null,
  set: (photo: string) => set(() => ({ photo })),
}));
