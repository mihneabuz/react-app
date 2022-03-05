import React from "react"
import { Box, Button, Text, TextInput } from "grommet"

import netclient, { LoginResponse } from "../utils/netclient"
import { Handler } from "../App"

class Login extends React.Component<{ setToken: Handler<string> }> {
  setToken: Handler<string>
  state: {
    username: string;
    password: string;

    message: string;
    messageColor: string;
  }

  constructor(props: any) {
    super(props);

    this.state = {
      username: "",
      password: "",
      message: "",
      messageColor: "red"
    }

    this.setToken = props.setToken.bind(this);
  }

  render(): React.ReactNode {
    return (
      <Box direction="column" align="center" pad={{ vertical: "large" }} width="60%">
          <TextInput 
            textAlign="center"
            placeholder="username"
            value={this.state.username}
            onChange={event => this.setState({username: event.target.value})}
          />
          <Box height="2em" />
          <TextInput 
            type="password"
            textAlign="center"
            placeholder="password"
            value={this.state.password}
            onChange={event => this.setState({password: event.target.value})}
          />
          <Box height="2em" />
          {
            this.state.message === "" 
              ? <Box height="1.3em" /> 
              : <Text color={this.state.messageColor}> {this.state.message} </Text>
          }
          <Box height="1em" />
          <Button color="purple" label="Login" size="large" onClick={() => this.makeRequest()}/>
      </Box>
    );
  }

  // TODO: input validation
  makeRequest() {
    if (this.state.username === "" || this.state.password === "")
      return;

    const data = {
      username: this.state.username,
      password: this.state.password
    }

    netclient.loginUser(data)
      .then((res) => this.handleRequest(res))
      .catch((err) => console.log(err));
  }

  handleRequest(result: LoginResponse) {
    console.log(result)

    if (result.success) {
      this.setToken(result.jwtToken);
      this.setState({
        username: "",
        password: "",
        message: "Login successfull!",
        messageColor: "green"
      });
    } else {
      this.setState({
        message: result.message,
        messageColor: "red"
      });
    }
  }
}

export default Login;
