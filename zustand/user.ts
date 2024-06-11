import { User } from "@/Type/User";
import { create } from "zustand";

const user: User = JSON.parse(localStorage.getItem("user") as any) || {
  _id: "",
  name: "",
  email: "",
  created_at: "", // You may want to set this to a default date/time
  phone_number: "",
  isLogedIn: false,
};

const initialUser: User = {
  _id: user._id,
  name: user.name,
  email: user.email,
  created_at: user.created_at, // You may want to set this to a default date/time
  phone_number: user.phone_number,
  isLogedIn: user.isLogedIn,
};

type State = {
  user: User;
};

type Action = {
  updateUser: (user: State["user"]) => void;
};

export const useUserStore = create<State & Action>((set) => ({
  user: initialUser,
  updateUser: (user: User) => set(() => ({ user: user })),
}));
