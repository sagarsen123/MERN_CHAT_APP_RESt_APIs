import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get, store) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/messages/users")
            set({ users: res.data.data })
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data.data })
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({ messages: [...messages, res.data.data] })
        } catch (err) {
            toast.error(err.response.data.data)
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    resetChatStore: () => set({
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
    }),

    subscribeToMessages: () => {
        try {
            const { selectedUser } = get()
            const { socket } = useAuthStore.getState()
            console.log(socket)
            if (!selectedUser || !socket) return;

            // need optimization: Done
            socket.on("newMessage", (newMessage) => {
                isSenderSelected = newMessage.senderId !== selectedUser._id
                if(!isSenderSelected) return;
                set({
                    messages: [...get().messages, newMessage]
                })
            });

        } catch (error) {
            console.log(error)
        }
    },

    unsubcribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        if (!socket) return;
        socket.off("newMessage");
    }

}))