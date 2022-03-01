import React from 'react';
import { Box, Button, Heading, Anchor } from 'grommet';
import { FormNext } from 'grommet-icons'
import { Handler, UserState } from '../App'

type TopbarProps = {
  userState:  UserState,
  onLogin:    Handler<{}>,
  onRegister: Handler<{}>,
  goHome:     Handler<{}>,
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

  constructor(props: TopbarProps) {
      super(props);
      this.onLogin    = props.onLogin.bind(this);
      this.onRegister = props.onRegister.bind(this);
      this.goHome     = props.goHome.bind(this);
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
      let level = this.props.userState.level;
      content = (
          <Box direction="row">
            <Heading level="2" color="purple" size="small">
              {user}
            </Heading>
            <Box width="1.2em"/>
            <Heading level="2" color="cyan" size="small">
              Level:
            </Heading>
            <Box width="0.4em"/>
            <Heading level="2" color="purple" size="small">
              {level}
            </Heading>
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
