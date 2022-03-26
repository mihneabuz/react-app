import React from "react"
import { Box, Button } from "grommet"
import { Handler } from '../App'

class Home extends React.Component<{goBrowser: Handler<{}>}> {
  constructor(props: { goBrowser: Handler<{}> }) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <Box direction="column">
        HOME
        <Button label="Start Browsing" alignSelf="center" color="cyan" onClick={this.props.goBrowser}/>
      </Box>
    )
  }
}

export default Home;
