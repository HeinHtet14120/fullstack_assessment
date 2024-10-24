import {create} from 'zustand';

const useNotificationStore = create((set) => ({
    notifications: [],
    addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, notification],
    })),
    clearNotifications: () => {
        set({ notifications: [] });
      },
}));

export default useNotificationStore;