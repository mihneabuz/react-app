import React from 'react';
import { Box, Grommet } from 'grommet';

import theme from './utils/theme'
import Topbar from './components/Topbar'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import Browser from './components/Browser';
import netclient from './utils/netclient';

export type UserInfo = {username: string, level: number}
export type UserState = "guest" | UserInfo
export type AppScreen = "home" | "login" | "register" | "browser"
export type Handler<T> = (x: T) => void
export type Agent = { id: string, name: string }
export type MyFile = { name: string, type: "file" | "dir" }
export type Proc = { name: string, cpu: number, mem: number, pid: number}

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
      token: ""
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
      clearToken: () => this.setState({ token: "", screen: "home", userState: "guest" }),
    };

    if (this.state.userState === "guest" && this.state.token !== "") {
      this.getUserInfo().catch(() => {
        this.setState({ token: "" });
      });
    }

    return (
      <Grommet full theme={theme}>
        <Topbar userState={this.state.userState} token={this.state.token} {...topbarHandlers} /> 
        <Box align="center">
          {this.renderPage()}
        </Box>
      </Grommet>
    );
  }

  renderPage(): React.ReactNode {
    if (this.state.screen === "home") {
      return <Home goBrowser={() => this.setState({ screen: "browser" })}/>
    } else if (this.state.screen === "browser") {
      return <Browser token={this.state.token} />
    } else if (this.state.screen === "login") {
      return <Login setToken={(s: string) => this.setState({ token: s })}/>
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
