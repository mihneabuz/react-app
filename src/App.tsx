import React from 'react';
import { Box, Grommet } from 'grommet';

import theme from './utils/theme'
import Topbar from './components/Topbar'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import netclient from './utils/netclient';

export type UserInfo = {username: string, level: number}
export type UserState = "guest" | UserInfo
export type AppScreen = "home" | "login" | "register"
export type Handler<T> = (x: T) => void

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
      token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsZXZlbCI6MSwiaWQiOiI0NDVlNjY2MS04MmFhLTRmZTctYmE3My02NDI5MzNjZjExNzEiLCJleHAiOjE2NDYyNDcyMDksInVzZXJuYW1lIjoiYXJjaCJ9.DQVHN2ZKqcAyjMIpixjuaYF9k5sODuq1fBTkbkQMGVw",
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

    if (this.state.userState === "guest" && this.state.token !== "") {
      this.getUserInfo().catch(() => {
        console.log("BAD TOKEN!");
        this.setState({token: ""});
      });
    }

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
      return <Home />
    } else if (this.state.screen === "login") {
      return <Login />
    } else if (this.state.screen === "register") {
      return <Register />
    }
  }

  async getUserInfo(): Promise<void> {
    const user = await netclient.userInfo(this.state.token);
    this.setState({
      userState: user
    })
  }
}

export default App;
