// export const getToken = () => localStorage.getItem("user_token");
export const getToken = () => localStorage.getItem("token");
export const clearToken = () => localStorage.removeItem("token");

export const saveToken = (token) => localStorage.setItem("token", token); //solved
