import React from 'react';
import { Box, Grommet } from 'grommet';

import theme from './theme'
import Topbar from './Topbar'

type UserState = "guest" | {username: string, level: number}
type AppScreen = "home" | "login" | "register"

class App extends React.Component {
  state: {
    userState: UserState,
    screen: AppScreen
    token: string
  }

  constructor(props: any) {
    super(props);

    this.state = {
      userState: "guest" as const,
      screen: "home" as const,
      token: "",
    }
  }

  handleLoginButton(): void {
    this.setState({
      screen: "login",
      userState: "guest",
      token: "",
    });
  } 

  handleRegisterButton(): void {
    this.setState({
      screen: "register",
      userState: "guest",
      token: "",
    });
  }

  handleHomeButton(): void {
    this.setState({
      screen: "home",
    });
  }

  render(): React.ReactNode {
    const topbarHandlers = {
      onLogin: () => this.handleLoginButton(),
      onRegister: () => this.handleRegisterButton(),
      goHome: () => this.handleHomeButton(),
    }

    return (
      <Grommet theme={theme}>
        <Topbar {...topbarHandlers} /> 
        {this.renderPage()}
      </Grommet>
    );
  }

  renderPage(): React.ReactNode {
    if (this.state.screen === "home") {
      return <Box align="center"> HOME </Box>
    } else if (this.state.screen === "login") {
      return <Box align="center"> LOGIN </Box>
    } else if (this.state.screen === "register") {
      return <Box align="center"> REGISTER </Box>
    }
  }
}

export default App;
