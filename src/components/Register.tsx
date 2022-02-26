import React from 'react';
import { Box, Button, TextInput } from 'grommet';
import { Hide, View } from 'grommet-icons'

class Register extends React.Component {
  state: {
    username: string;
    password: string;
    reveal: boolean;
  }

  constructor(props: any) {
    super(props);

    this.state = {
      username: "",
      password: "",
      reveal: false
    }
  }

  render(): React.ReactNode {
    return (
      <Box direction="column" align="center" pad={{ vertical: "large" }} width="50%">
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
          <Button
            icon={this.state.reveal ? <View size="large" /> : <Hide size="large" />}
            onClick={() => this.setState({reveal: !this.state.reveal})}
          />
          <Box height="2em" />
          <Button color="purple" label="Register" size="medium" onClick={() => this.makeRequest()}/>
      </Box>
    );
  }

  makeRequest() {
    console.log(this.state.username);
    console.log(this.state.password);
  }
}

export default Register;
