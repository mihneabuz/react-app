const apiRoute = "http://localhost:8080"

export type Response = { success: boolean, message: string }

const jsonHeaders = {
  "Accept": "application/json",
  "Content-Type": "application/json"
}

const netclient = {
  userRegister: async function(data: {username: string, password: string}): Promise<Response> {
    const response = await fetch(apiRoute + "/user/register", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export default netclient;
