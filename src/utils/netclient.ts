import { UserInfo } from "../App"

const apiRoute = "http://localhost:8080"

export type Response = { success: boolean, message: string }
export type LoginResponse = { success: boolean, message: string, jwtToken: string }

const jsonHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json"
}

const authHeaders = (token: string) => ({
    "Authorization": "Bearer " + token,
    ...jsonHeaders,
})

const netclient = {
  registerUser: async (data: { email: string, username: string, password: string}): Promise<Response> => {
    const response = await fetch(apiRoute + "/user/register", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(data)
    });
    return response.json();
  },

  loginUser: async (data: {username: string, password: string}): Promise<LoginResponse> => {
    const response = await fetch(apiRoute + "/user/login", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(data)
    });
    return response.json();
  },

  userInfo: async (token: string): Promise<UserInfo> => {
    console.log(authHeaders(token))
    const response = await fetch(apiRoute + "/user/info", {
      method: "GET",
      headers: authHeaders(token),
    });
    return response.json();
  },

  updateUsername: async (data: {newUsername: string}, token: string): Promise<Response> => {
    const response = await fetch(apiRoute + "/user/updateUsername", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export default netclient;
