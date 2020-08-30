import React from 'react';
import UploadService from '../../Service/uploadFile';
import styles from './Dashboard.module.scss';
import DragAndDrop from './DragAndDrop';
import logoImage from '../../assets/Group_11.png';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import AudioPlayer from 'material-ui-audio-player';
import Alert from '@material-ui/lab/Alert';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CachedIcon from '@material-ui/icons/Cached';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

import PropTypes from 'prop-types';
//import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import SubjectIcon from '@material-ui/icons/Subject';
import ChatIcon from '@material-ui/icons/Chat';

import ChatBox from './ChatBox';
import Summery from './Summery';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} className={styles.boxmuyi}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

class Dashboard extends React.Component {
  state = {
    selectedFile: null,
    currentFile: null,
    progress: 0,
    message: '',
    FileInfos: [],
    formatError: false,
    tabValue: 0,
    chat: [],
    soundUrl: '',
    summary: '',
    loader: false,
  };

  muiTheme = createMuiTheme({});
  //   componentDidMount(){
  //     UploadService.getFiles().then((response) => {
  //       this.setState({fileInfos:response.data});
  //     });
  //   };

  onFileChange = (event) => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });

    let currentFile = event.target.files[0];
    console.log(currentFile);

    this.setState({ currentFile: currentFile, progress: 0 });

    let AudType = event.target.files[0].type.split('/');
    if (currentFile.length !== 0 && AudType[0] === 'audio') {
      UploadService.upload(currentFile, (event) => {
        this.setState({
          progress: Math.round((100 * event.loaded) / event.total),
        });
      })
        .then((response) => {
          this.setState({
            message: response.data.message,
            FileInfos: response.data,
            loader: true,
          });
        })
        .catch(() => {
          this.setState({
            progress: 0,
            message: 'Could not upload the file!',
            currentFile: undefined,
          });
        });
    } else {
      this.setState({ formatError: true });
      setTimeout(
        function () {
          this.setState({ formatError: false });
        }.bind(this),
        3000
      );
    }
    this.setState({ selectedFiles: undefined });
  };

  clearStates = () => {
    this.setState({
      selectedFile: null,
      currentFile: null,
      progress: 0,
      message: '',
      FileInfos: [],
      formatError: false,
      tabValue: 0,
      chat: [],
      soundUrl: '',
      summary: '',
      loader: false,
    });
  };

  getReport = () => {
    UploadService.getFileContents(this.state.FileInfos)
      .then((response) => {
        this.setState({
          chat: response.data.messages,
          soundUrl: response.data.soundUrl,
          summary: response.data.summary,
          loader: false,
        });
        console.log(response.data);
      })
      .catch(() => {
        console.log('error');
      });
  };

  contaTempo = () => {
    let myInterval = setInterval(() => {
      UploadService.intervalCheck(this.state.FileInfos)
        .then((response) => {
          if (response.data.message === 'file_exist') {
            setTimeout(() => {
              this.getReport();
            }, 10000);
            clearInterval(myInterval);
          } else {
            console.log(response.data);
          }
        })
        .catch(() => {
          console.log('error');
        });
    }, 5000);
  };

  handleDrop = (files) => {
    this.setState({ selectedFile: files });
    let currentFile = files[0];
    console.log(currentFile);

    this.setState({ currentFile: currentFile, progress: 0 });

    let AudType = files[0].type.split('/');
    if (currentFile.length !== 0 && AudType[0] === 'audio') {
      UploadService.upload(currentFile, (event) => {
        this.setState({
          progress: Math.round((100 * event.loaded) / event.total),
        });
      })
        .then((response) => {
          this.setState({
            message: response.data.message,
            FileInfos: response.data,
            loader: true,
          });
          console.log(response.data);
          this.contaTempo();
        })
        .catch(() => {
          this.setState({
            progress: 0,
            message: 'Could not upload the file!',
            currentFile: undefined,
          });
        });
    } else {
      this.setState({ formatError: true });
      setTimeout(
        function () {
          this.setState({ formatError: false });
        }.bind(this),
        3000
      );
    }
    this.setState({ selectedFiles: undefined });
  };

  uploadClick() {
    document.getElementById('selectImage').click();
  }

  tabHandleChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  rename = (name) => {
    console.log(name);
    let updatedChat = this.state.chat.map((i) => {
      let temp = [];
      if (name.old === i.Speaker) {
        temp = {
          End_Time: i.End_Time,
          Speaker: name.new,
          Start_Time: i.Start_Time,
          Transcript: i.Transcript,
          Unnamed: i.Unnamed,
          high_lighted: i.high_lighted,
        };
      } else {
        temp = {
          End_Time: i.End_Time,
          Speaker: i.Speaker,
          Start_Time: i.Start_Time,
          Transcript: i.Transcript,
          Unnamed: i.Unnamed,
          high_lighted: i.high_lighted,
        };
      }
      return temp;
    });
    this.setState({
      chat: updatedChat,
    });
  };

  render() {
    return (
      <div className={styles.dashboard}>
        <DragAndDrop handleDrop={this.handleDrop}>
          {this.state.currentFile && (
            <LinearProgress variant='determinate' value={this.state.progress} />
          )}
          <div className={styles.dashHeader}>
            <img src={logoImage} alt='Logo' />
          </div>
          <div className={styles.dashBody}>
            <label className='btn btn-default'>
              <input
                type='file'
                onChange={this.onFileChange}
                id='selectImage'
                hidden
              />
            </label>
            {this.state.formatError ? (
              <Alert severity='error'>
                This format won't support in this application!
              </Alert>
            ) : (
              ''
            )}
            {this.state.FileInfos.length !== 0 ? (
              <ThemeProvider theme={this.muiTheme}>
                <AudioPlayer src={this.state.FileInfos.filePath} />
              </ThemeProvider>
            ) : (
              ''
            )}
          </div>
          <IconButton
            color='primary'
            aria-label='upload picture'
            component='span'
            className={styles.largeButton}
            onClick={this.uploadClick}
          >
            <CloudUploadIcon />
          </IconButton>
          <div className={styles.messageBottm}>
            Drag and drop the file here or click on the mic to upload audio file
          </div>
        </DragAndDrop>
        <div className={styles.messageSect}>
          <div className={styles.messageSectHeader}>
            <div className={styles.rightAllign}>
              <Tooltip title='Refresh'>
                <IconButton
                  color='primary'
                  aria-label='upload picture'
                  component='span'
                  onClick={this.clearStates}
                >
                  <CachedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='More'>
                <IconButton
                  color='primary'
                  aria-label='upload picture'
                  component='span'
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div>
            {/* <AppBar position='static'> */}
            <Paper square>
              <Tabs
                value={this.state.tabValue}
                onChange={this.tabHandleChange}
                aria-label='simple tabs example'
                indicatorColor='primary'
                textColor='primary'
              >
                <Tooltip title='Chat'>
                  <Tab
                    icon={<ChatIcon />}
                    aria-label='chat'
                    label='Chat format'
                    {...a11yProps(0)}
                  />
                </Tooltip>
                <Tooltip title='Summary'>
                  <Tab
                    icon={<SubjectIcon />}
                    aria-label='Summary'
                    label='summary'
                    {...a11yProps(1)}
                  />
                </Tooltip>
              </Tabs>
              {/* </AppBar> */}
            </Paper>
            <TabPanel value={this.state.tabValue} index={0}>
              {this.state.chat.length !== 0
                ? this.state.chat.map((item) => {
                    return (
                      <ChatBox
                        key={item.Start_Time}
                        chating={item}
                        renamed={(name) => this.rename(name)}
                      />
                    );
                  })
                : ''}
              {this.state.loader ? (
                <center>
                  <CircularProgress />
                </center>
              ) : (
                ''
              )}
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={1}>
              {this.state.loader ? (
                <center>
                  <CircularProgress />
                </center>
              ) : (
                <Summery
                  summary={this.state.summary}
                  soundUrl={this.state.soundUrl}
                />
              )}
            </TabPanel>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
