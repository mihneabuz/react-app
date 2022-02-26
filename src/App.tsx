import React from 'react';
import { Box, Grommet } from 'grommet';

import theme from './utils/theme'
import Topbar from './components/Topbar'
import Register from './components/Register'

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

  setToken(token: string): void {
    this.setState({
      token: token,
    });
  }

  render(): React.ReactNode {
    const topbarHandlers = {
      onLogin: () => this.handleLoginButton(),
      onRegister: () => this.handleRegisterButton(),
      goHome: () => this.handleHomeButton(),
    };

    return (
      <Grommet full theme={theme}>
        <Topbar userState={this.state.userState} {...topbarHandlers} /> 
        <Box align="center">
          {this.renderPage()}
        </Box>
      </Grommet>
    );
  }

  renderPage(): React.ReactNode {
    if (this.state.screen === "home") {
      return <Box align="center"> HOME </Box>
    } else if (this.state.screen === "login") {
      return <Box align="center"> LOGIN </Box>
    } else if (this.state.screen === "register") {
      return <Register />
    }
  }
}

export default App;
