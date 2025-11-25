export const checkAuth = async (set) => {
    try {
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data })
    } catch (error) {
        set({ authUser: null })
    } finally {
        set({ isCheckingAuth: false })
    }
}