import { create } from "zustand";

interface UserDetails {
  name: string;
  email: string;
  password: string;
  code: string;
}

interface AppState {
  userDetails: UserDetails;
  authScreen: "login" | "signup" | "verifyEmail";
  setUserDetails: (userDetails: UserDetails) => void;
  setAuthScreen: (screen: "login" | "signup" | "verifyEmail") => void;
}

export const useStore = create<AppState>((set) => ({
  userDetails: {
    name: "",
    email: "",
    password: "",
    code: "",
  },
  authScreen: "login",
  setUserDetails: (userDetails) => set({ userDetails }),
  setAuthScreen: (authScreen) => set({ authScreen }),
}));
