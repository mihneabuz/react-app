import React from "react";
import { Box, Button, Text, TextInput, CheckBox, FileInput } from "grommet";
import { FormSearch, Trash, Download, Upload } from "grommet-icons";
import { Agent, MyFile, Proc } from '../App';
import netclient from "../utils/netclient";
import download from "../utils/download";

type BrowserState = {
    gotAgents: boolean,
    agents: Agent[],

    currentAgent: null | Agent,

    path: null | string,
    gotFiles: boolean,
    files: MyFile[], 
    content: string,

    search: string,
    searchResult: MyFile[],

    bycpu: boolean,
    bymem: boolean,
    procs: Proc[],

    touch: string,

    toUpload: File[],

    message: string,
    messageColor: string,
}

class Browser extends React.Component<{ token: string }, BrowserState> {
  constructor(props: { token: string }) {
    super(props);

    this.state = {
      gotAgents: false,
      agents: [],
      currentAgent: null,
      gotFiles: false,
      path: null,
      files: [],
      content: "",
      search: "",
      searchResult: [],
      bycpu: false,
      bymem: false,
      procs: [],
      touch: "",
      toUpload: [],
      message: "",
      messageColor: "red",
    }
  }

  async getAgents() {
    const res = await netclient.getAgents(this.props.token);
    console.log(res);

    if (res.success) {
      this.setState({ 
        gotAgents: true,
        agents: res.agents,
      });
    } else {
      this.setState({
        gotAgents: true,
        message: "Cannot retreive agents",
        messageColor: "red",
      });
    }
  }

  async getFiles(override: boolean) {
    if (this.state.currentAgent !== null && this.state.path !== null) {
      if (!this.state.gotFiles || override) {
        const res = await netclient.getFiles(this.props.token, this.state.currentAgent.id, this.state.path);

        if (res.success) {
          this.setState({ 
            files: JSON.parse(res.foundFiles).sort((a: any, _: any) => a.type === "dir" ? -1 : 1),
            gotFiles: true,
          });
        } else {
          this.setState({
            gotFiles: true,
            message: "Cannot retreive files",
            messageColor: "red",
          });
        }
      }
    }
  }

  async getContent(path: string) {
    if (this.state.currentAgent !== null) {
      const res = await netclient.getContent(this.props.token, this.state.currentAgent.id, path);

      console.log(res);

      if (res.success) {
        this.setState({
          content: res.content,
        });
      } else {
        this.setState({
          message: "Cannot retreive file content",
          messageColor: "red",
        });
      }
    }
  }

  async downloadFile(path: string) {
    if (this.state.currentAgent !== null) {
      const res = await netclient.downloadFile(this.props.token, this.state.currentAgent.id, path);
      console.log(res);
      if (res.success) {
        const data = atob(res.base64file);
        download(data, "download", null);
        this.setState({
          message: "Download successfull",
          messageColor: "green",
        });
      } else {
        this.setState({
          message: "Cannot download file",
          messageColor: "red",
        });
      }
    }
  }

  popPath() {
    if (this.state.searchResult.length > 0) {
      this.setState({
        searchResult: [],
        message: ""
      });
      return;
    }
    
    let path = this.state.path;

    if (path !== null && path !== "") {
      const pos = path.search("/");
      if (pos === -1) {
        path = "";
      } else {
        path = path.slice(0, pos);
      }

      this.setState({
        path: path,
        gotFiles: false,
        message: ""
      });
    }
  }

  async getSearchResults() {
    if (this.state.currentAgent !== null) {
      const res = await netclient.searchFiles(this.props.token, this.state.currentAgent.id, this.state.search)

      if (res.success) {
        this.setState({ 
          searchResult: JSON.parse(res.foundFiles),
          message: "",
        });
      } else {
        this.setState({
          message: "Cannot retreive file content",
          messageColor: "red"
        })
      }
    }
  }

  async getProcs() {
    if (this.state.currentAgent !== null) {
      const sortBy = this.state.bycpu ? "cpu" : this.state.bymem ? "mem" : "";
      const res = await netclient.getProcs(this.props.token, this.state.currentAgent.id, sortBy);

      console.log(res);

      if (res.success) {
        this.setState({ 
          procs: JSON.parse(res.runningProcs),
        });
      } else {
        this.setState({
          message: "Cannot retreive processes",
          messageColor: "red"
        })
      }
    }
  }

  renderButtons(): React.ReactNode {
    return (
      <Box direction="row" align="center">
        <Text color="purple" size="larger"> procs </Text>
        <Box width="1em"/>
        <CheckBox color="cyan" label="cpu" onClick={(event: any) => this.setState({ bycpu: event.target.checked })} />
        <Box width="1em"/>
        <CheckBox color="cyan" label="mem" onClick={(event: any) => this.setState({ bymem: event.target.checked })} />
        <Button icon={<FormSearch size="38em"/>} onClick={() => this.getProcs() }/>
      </Box>
    );
  }

  async createFile(type: "file" | "dir") {
    if (this.state.currentAgent !== null) {
      const path = (this.state.path !== "" ? this.state.path + "/" : "") + this.state.touch;
      const res = await netclient.createFile(this.props.token, this.state.currentAgent.id, path, type); 

      if (res.success) {
        this.setState({ 
          files: [],
          searchResult: [],
          gotFiles: false,
          touch: "",
          message: "Creation successfull!",
          messageColor: "green"
        });
      } else {
        this.setState({
          message: "Cannot create file",
          messageColor: "red"
        })
      }
    }
  }

  createButtons(): React.ReactNode {
    return (
     <Box direction="row" align="center">
        <TextInput 
          textAlign="center"
          value={this.state.touch}
          onChange={(event: any) => this.setState({ touch: event.target.value })}
        />
        <Box width="1em"/>
        <Button label="touch" fill="vertical" onClick={() => this.createFile("file") }/>
        <Box width="1em"/>
        <Button label="mkdir" fill="vertical" onClick={() => this.createFile("dir") }/>
      </Box>
    );
  }

  async deleteFile(path: string) {
    if (this.state.currentAgent !== null) {
      const res = await netclient.deleteFile(this.props.token, this.state.currentAgent.id, path);

      if (res.success) {
        this.setState({
          files: [],
          gotFiles: false,
          message: "Deletion successfull",
          messageColor: "green"
        });
      } else {
        this.setState({
          message: "Cannot delete file",
          messageColor: "red"
        });
      }
    }
  }

  getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result !== null) {
          let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
          if ((encoded.length % 4) > 0) {
            encoded += '='.repeat(4 - (encoded.length % 4));
          }
          resolve(encoded);
        }
      };
      reader.onerror = error => reject(error);
    });
  }

  async uploadFiles() {
    if (this.state.currentAgent !== null) {
      const files = this.state.toUpload;
      for (var file of files) {
        const fullPath = this.state.path + "/" + file.name;
        const content = await this.getBase64(file);
        console.log(fullPath);
        console.log(content);
        const res = await netclient.uploadFile(this.props.token, this.state.currentAgent.id, fullPath, String(content));

        if (res.success) {
          this.setState({
            toUpload: [],
            message: "Upload successfull",
            messageColor: "green"
          });
        } else {
          this.setState({
            toUpload: [],
            message: "Cannot upload file",
            messageColor: "red"
          });
        }
      }
    }
  }

  renderUpload(): React.ReactNode {
    if (this.state.searchResult.length > 0)
      return null;

    return (
      <Box direction="column" align="center">
        <Upload size="large" onClick={ () => this.uploadFiles() }/>
        <Box height="0.5em"/>
        <FileInput onChange={ event => {
            const toUpload = [];
            var fileList = event.target.files;
            if (fileList !== null && fileList !== undefined) {
              for (let i = 0; i < fileList.length; i += 1)
                  toUpload.push(fileList[i]);
            }
            this.setState({ toUpload: toUpload })
          }
        }/>
      </Box>
    )
  }

  renderContent(): React.ReactNode {
    if (this.state.currentAgent === null) {
      return (
        <Box direction="column" align="center">
          <Text color="cyan" size="large"> Available Agents </Text>
          <Box height="1em" />
          {
            this.state.agents.map((agent: Agent) => 
              <Button color="purple" label={agent.name} key={agent.id} onClick={
                () => this.setState({ 
                  currentAgent: agent,
                  path: "",
                  gotFiles: false,
                  files: [],
                })
              }/>)
          }
        </Box>
      );
    } else if (this.state.procs.length > 0) {
      const agentName = this.state.currentAgent === null ? "null" : this.state.currentAgent.name;
      return (
        <Box>
          <Text color="cyan" size="medium" alignSelf="center"> {agentName} </Text>
          <Text color="purple" size="small" alignSelf="center"> {"root/" + this.state.path} </Text>
          <Box height="1em" />
          {
            this.state.procs.map((proc: Proc) => {
              return (
                <Box direction="row" key={proc.pid} align="center">
                  <Text color="cyan"> {proc.name} </Text>
                  <Box width="2em" />
                  <Text color="purple"> {"cpu: " + proc.cpu + "%"} </Text>
                  <Box width="2em" />
                  <Text color="purple"> {"mem: " + proc.mem + "%"} </Text>
                </Box>
              );
            })
          }
          <Box height="2em" />
          <Button color="purple" fill="horizontal" label="Back" onClick={() => this.setState({ search: "", procs: [] })}/>
        </Box>
      ); 
    } else {
      const files = this.state.searchResult.length > 0 ? this.state.searchResult : this.state.files;
      return (
        <Box direction="column" align="center">
          <Text color="cyan" size="medium" alignSelf="center"> {this.state.currentAgent.name} </Text>
          <Text color="purple" size="small" alignSelf="center"> {"root/" + this.state.path} </Text>
          <Box height="1em" />
          { this.renderButtons() }
          <Box height="1em" />
          <Box direction="row" align="center">
            <Button color="cyan" label="agents" alignSelf="center" onClick={
              () => this.setState({
                currentAgent: null,
                message: "",
                gotAgents: false,
                gotFiles: false,
                content: ""
              })
            }/>
            <Box width="2em" />
            <TextInput 
              textAlign="center"
              placeholder="search"
              value={this.state.search}
              onChange={(event: any) => this.setState({ search: event.target.value })}
            />
            <Button
              alignSelf="center"
              icon={<FormSearch size="54em"/>}
              onClick={() => this.getSearchResults()}
            />
          </Box>
          <Box height="2em" />
          {
            files.map((file: MyFile) => {
              if (file.type === "dir")  
                return (
                  <Box width="90%" key={file.name}>
                    <Box direction="row" align="center">
                      <Button color="cyan" label={file.name} fill="horizontal" onClick={
                        () => {
                          const newPath = this.state.path + (this.state.path !== "" ? "/" : "") + file.name;
                          this.setState({ path: newPath, gotFiles: false });
                        }
                      }/>
                      <Box width="0.5em" />
                      <Trash onClick={async () => {
                          const path = this.state.searchResult.length > 0 
                            ? file.name
                            : this.state.path + "/" + file.name;
                          await this.deleteFile(path);
                        }
                      }/>
                    </Box>
                    <Box height="1em" />
                  </Box>
                )

              if (file.type === "file")
                return (
                  <Box width="70%" key={file.name}>
                    <Box direction="row">
                      <Button color="purple" label={file.name} fill="horizontal" onClick={
                        this.state.searchResult.length > 0 
                          ? () => this.getContent(file.name)
                          : () => this.getContent(this.state.path + "/" + file.name)
                      }/>
                      <Box width="1em" />
                      <Download onClick={async () => {
                          const path = this.state.searchResult.length > 0 
                            ? file.name
                            : this.state.path + "/" + file.name;

                          await this.downloadFile(path);
                        }
                      }/>
                      <Box width="1em" />
                      <Trash onClick={async () => {
                          const path = this.state.searchResult.length > 0 
                            ? file.name
                            : this.state.path + "/" + file.name;

                          await this.deleteFile(path);
                        }
                      }/>
                    </Box>
                    <Box height="1em" />
                  </Box>
                )

              return null
            })
          }
          <Box height="1em"/>
          {
            this.state.path !== "" || this.state.searchResult.length > 0
              ? <Button color="purple" fill="horizontal" label="Back" onClick={
                  () => this.popPath()
                }/>
              : null
          }
          <Box height="2em"/>
          { this.renderUpload() }
          <Box height="1em"/>
          { 
            this.state.searchResult.length === 0 
              ? this.createButtons()
              : null
          }
          <Box height="2em"/>
          {
            this.state.content !== ""
              ? <Box direction="column"> 
                  <Text color="cyan" alignSelf="center"> Contents </Text>
                  <Box fill background="darker" height="30em" width="30em">
                    <Text> {this.state.content} </Text>
                  </Box>
                </Box> 
              : null
          }
        </Box>
      )
    }
  }

  render(): React.ReactNode {
    console.log(this.state.path);

    if (!this.state.gotAgents) {
      this.getAgents();
    } else {
      this.getFiles(false);
    }

    return (
      <Box direction="column" align="center">
        <Box height="2em" />
        { this.renderContent() }
        {
          this.state.message === "" 
            ? <Box height="1.3em" /> 
            : <Text color={this.state.messageColor}> {this.state.message} </Text>
        }
      </Box>
    )
  }
}

export default Browser;
