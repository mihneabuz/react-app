
const apiRoute = "http://localhost:8080"

export type Response = { success: boolean, message: string }

const request = {
  post: (url: string) => {
    let req = new XMLHttpRequest();
    req.open("POST", url)
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json");
    return req;
  },
  get: (url: string) => {
    let req = new XMLHttpRequest();
    req.open("GET", url)
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json");
    return req;
  }
}

const netclient = {
  userRegister: function(data: { username: string, password: string }, handler: (r: Response) => void){
    let req = request.post(apiRoute + "/user/register");
    req.onreadystatechange = () => {
      if (req.readyState === 4) handler(JSON.parse(req.responseText));
    }
    req.send(JSON.stringify(data));
  }
}

export default netclient;
