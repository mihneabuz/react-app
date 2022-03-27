import React from 'react';
import { Box, Button, Heading, Anchor } from 'grommet';
import { FormNext } from 'grommet-icons'
import { Handler, UserState } from '../App'
import { CopyToClipboard } from 'react-copy-to-clipboard'

type TopbarProps = {
  userState:  UserState,
  onLogin:    Handler<{}>,
  onRegister: Handler<{}>,
  goHome:     Handler<{}>,
  clearToken: Handler<{}>,
  token: string
} 

function Bar(props: any) {
  return (
      <Box
        direction="row"
        align="center"
        justify="between"
        background="gray"
        height="4em"
        pad={{ left: "medium", right: "medium", vertical: "small" }}
        style={{ zIndex: "1" }}
        {...props}
      />
  );
}

class Topbar extends React.Component<TopbarProps> {
  onLogin:    Handler<{}>;
  onRegister: Handler<{}>;
  goHome:     Handler<{}>;
  clearToken: Handler<{}>

  constructor(props: TopbarProps) {
      super(props);
      this.onLogin    = props.onLogin.bind(this);
      this.onRegister = props.onRegister.bind(this);
      this.goHome     = props.goHome.bind(this);
      this.clearToken = props.clearToken.bind(this);
  }

  render(): React.ReactNode {
    let content: React.ReactNode;
    if (this.props.userState === "guest") {
      content = (
        <Box direction="row">
          <Button label=" Login " color="cyan" onClick={this.onLogin} />
          <Box width="0.5em"/>
          <Button label="Register" color="purple" onClick={this.onRegister}/>
        </Box>
      );
    } else {
      let user  = this.props.userState.username;
      content = (
          <Box direction="row">
            <Heading level="2" color="purple" size="small">
              {user}
            </Heading>
            <Box width="1em"/>
            <CopyToClipboard text={this.props.token} >
              <Button label="token" alignSelf="center" color="cyan"/>
            </CopyToClipboard>
            <Box width="1em"/>
            <Button label="sign out" alignSelf="center" color="purple" onClick={this.clearToken}/>
          </Box>
      );
    }

    return (
      <Bar> 
        <Anchor color="cyan">
          <Box direction="row" align="center">
            <FormNext color="purple" size="large"/>
            <Heading level="2" margin="none" color="cyan" onClick={this.goHome}>
              Title
            </Heading>
          </Box>
        </Anchor>
        {content} 
      </Bar>
    );
  }
}

export default Topbar;
