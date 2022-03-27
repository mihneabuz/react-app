import { UserInfo, Agent } from "../App"

const apiRoute = "http://10.81.134.247:8080"

export type Response = { success: boolean, message: string }
export type LoginResponse = { success: boolean, message: string, jwtToken: string }
export type AgentsResponse = { success: boolean, message: string, agents: Agent[] }
export type FilesResponse = { success: boolean, message: string, foundFiles: string }
export type ProcResponse = { success: boolean, message: string, runningProcs: string }
export type ContentResponse = { success: boolean, message: string, content: string }
export type FileDownload = { success: boolean, message: string, base64file: string }

const jsonHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json"
}

const authHeaders = (token: string) => token !== "" ? ({
    "Authorization": "Bearer " + token,
    ...jsonHeaders,
}) : jsonHeaders;

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
  },

  getAgents: async (token: string): Promise<AgentsResponse> => {
    const response = await fetch(apiRoute + "/files/agents", {
      method: "GET",
      headers: authHeaders(token),
    });
    return response.json();
  },

  getFiles: async (token: string, id: string, path: string): Promise<FilesResponse> => {
    const response = await fetch(apiRoute + "/files/dir", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ id: id, path: path })
    });
    return response.json();
  },

  getContent: async (token: string, id: string, path: string): Promise<ContentResponse> => {
    const response = await fetch(apiRoute + "/files/content", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ id: id, path: path })
    });
    return response.json();
  },

  searchFiles: async (token: string, id: string, pattern: string): Promise<FilesResponse> => {
    const response = await fetch(apiRoute + "/files/search", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ id: id, pattern: pattern })
    });
    return response.json();
  },

  createFile: async (token: string, id: string, path: string, type: "file" | "dir"): Promise<Response> => {
    const response = await fetch(apiRoute + "/files/create", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ id: id, path: path, type: type })
    });
    return response.json();
  },

  deleteFile: async (token: string, id: string, path: string): Promise<Response> => {
    const response = await fetch(apiRoute + "/files/delete", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ id: id, path: path })
    });
    return response.json();
  },

  downloadFile: async (token: string, id: string, path: string): Promise<FileDownload> => {
    const response = await fetch(apiRoute + "/files/download", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ id: id, path: path })
    });
    return response.json();
  },

  uploadFile: async (token: string, id: string, path: string, base64file: string): Promise<Response> => {
    const response = await fetch(apiRoute + "/files/upload", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ id: id, path: path, base64file: base64file })
    });
    return response.json();
  },

  getProcs: async (token: string, id: string, sortBy: string): Promise<ProcResponse> => {
    const response = await fetch(apiRoute + "/files/procs", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ id: id, orderBy: sortBy, count: 20})
    });
    return response.json();
  },
}

export default netclient;
