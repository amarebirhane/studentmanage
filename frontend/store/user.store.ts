import { create } from 'zustand';
import { User } from '@/types/user';

interface UserStore {
    users: User[];
    setUsers: (users: User[]) => void;
    addUser: (user: User) => void;
    updateUser: (id: string, updates: Partial<User>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    users: [],
    setUsers: (users) => set({ users }),
    addUser: (user) => set((state) => ({ users: [...state.users, user] })),
    updateUser: (id, updates) =>
        set((state) => ({
            users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),
}));
