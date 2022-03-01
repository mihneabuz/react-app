import React from 'react';
import { Box, Button, Text, TextInput } from 'grommet';
import { Hide, View } from 'grommet-icons'
import netclient, { Response } from '../utils/netclient'

class Register extends React.Component {
  state: {
    email: string;
    username: string;
    password: string;
    reveal: boolean;

    message: string;
    messageColor: string;
  }

  constructor(props: any) {
    super(props);

    this.state = {
      email: "",
      username: "",
      password: "",
      reveal: false,

      message: "",
      messageColor: "red"
    }
  }

  render(): React.ReactNode {
    return (
      <Box direction="column" align="center" pad={{ vertical: "large" }} width="60%">
          <TextInput 
            textAlign="center"
            placeholder="email"
            value={this.state.email}
            onChange={event => this.setState({email: event.target.value})}
          />
          <Box height="2em" />
          <TextInput 
            textAlign="center"
            placeholder="username"
            value={this.state.username}
            onChange={event => this.setState({username: event.target.value})}
          />
          <Box height="2em" />
          <TextInput 
            type={this.state.reveal ? "text" : "password"}
            textAlign="center"
            placeholder="password"
            value={this.state.password}
            onChange={event => this.setState({password: event.target.value})}
          />
          <Box height="0.2em" />
          <Button
            icon={this.state.reveal ? <View size="34em" /> : <Hide size="34em" />}
            onClick={() => this.setState({reveal: !this.state.reveal})}
          />
          <Box height="1em" />
          {
            this.state.message === "" 
              ? <Box height="1.3em" /> 
              : <Text color={this.state.messageColor}> {this.state.message} </Text>
          }
          <Box height="1em" />
          <Button color="purple" label="Register" size="medium" onClick={() => this.makeRequest()}/>
      </Box>
    );
  }

  // TODO: input validation
  makeRequest() {
    if (this.state.email === "" || this.state.username === "" || this.state.password === "")
      return;

    const data = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password
    }

    netclient.registerUser(data)
      .then((res) => this.handleRequest(res))
      .catch((err) => console.log(err));
  }

  handleRequest(result: Response) {
    console.log(result)

    if (result.success) {
      this.setState({
        email: "",
        username: "",
        password: "",
        message: "Register successfull!",
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

export default Register;
