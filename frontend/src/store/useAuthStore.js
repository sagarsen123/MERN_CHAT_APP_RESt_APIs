import { create } from "zustand"
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";


export const useAuthStore = create((set, store) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data.data })
        } catch (error) {
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account Created Successfully")
            set({ authUser: res.data });
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },
    logIn: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            toast.success("LoggedIn Successfully")
            set({ authUser: res.data.data });
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },
    logOut: async () => {
        set({ isLoggingOut: true })
        try {
            const res = await axiosInstance.post('/auth/logout')
            toast.success("Logged Out Successfully");
            set({ authUser: null });
        } catch (error) {
            console.log(error)
            set({ authUser: null });
            toast.success(error.response.data.message)
        } finally {
            set({
                authUser: null,
                isCheckingAuth: false,
                isSigningUp: false,
                isLoggingIn: false,
                isUpdatingProfile: false,
                onlineUsers: [],
                isLoggingOut: false
            })
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put(
                "/auth/update-profile",
                data
            )
            set({ authUser: res.data.data })
            toast.success("Profile Updated Successfully")
        } catch (error) {
            console.log("error in updating the profile", error)
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    }

}));