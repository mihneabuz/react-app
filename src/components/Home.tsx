import React from "react";
import { Box, Button, Image } from "grommet";
import { Handler } from '../App';

class Home extends React.Component<{goBrowser: Handler<{}>}> {
  constructor(props: { goBrowser: Handler<{}> }) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <Box direction="column">
        <Box height="4em" />
        <Image src={require("../icon.png")}/>
        <Box height="4em" />
        <Button label="Start Browsing" alignSelf="center" color="cyan" size="large" onClick={this.props.goBrowser}/>
      </Box>
    )
  }
}

export default Home;
