import { create } from "zustand";

type UserDetails = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type UserDetailState = {
  userDetails: UserDetails | null;

  updateUserDetails: (newState: UserDetails) => void;
};

export const useUserDetailsState = create<UserDetailState>((set) => ({
  userDetails: null,
  updateUserDetails: (newState) =>
    set({
      userDetails: newState,
    }),
}));
