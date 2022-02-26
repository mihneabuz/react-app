import React from 'react';
import { Box, Button, Heading, Anchor } from 'grommet';
import { FormNext } from 'grommet-icons'

type Handler = () => void
type ButtonHandlers = {
  onLogin: Handler,
  onRegister: Handler,
  goHome: Handler,
} 

function Bar(props: any) {
  return (
      <Box
        direction="row"
        align="center"
        justify="between"
        background="gray"
        pad={{ left: "medium", right: "medium", vertical: "small" }}
        elevation="medium"
        style={{ zIndex: "1" }}
        {...props}
      />
  );
}

class Topbar extends React.Component<ButtonHandlers> {
  onLogin:    Handler;
  onRegister: Handler;
  goHome:     Handler;

  constructor(props: ButtonHandlers) {
      super(props);
      this.onLogin = props.onLogin.bind(this);
      this.onRegister = props.onRegister.bind(this);
      this.goHome = props.goHome.bind(this);
  }

  render(): React.ReactNode {
    return (
      <Bar> 
        <Anchor color="cyan">
          <Box direction="row" align="center">
            <FormNext color="purple" size="large"/>
            <Heading level="2" margin="none" color="cyan" onClick={this.goHome}>
              FriedLiver
            </Heading>
          </Box>
        </Anchor>
        <div>
          <Button label=" Login " color="cyan" onClick={this.onLogin} />
          <a> </a>
          <Button label="Register" color="purple" onClick={this.onRegister}/>
        </div> 
      </Bar>
    );
  }
}

export default Topbar;
