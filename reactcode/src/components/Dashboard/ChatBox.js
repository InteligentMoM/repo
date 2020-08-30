import React from 'react';
import styles from './Dashboard.module.scss';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import parse from 'html-react-parser';

export default class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AnchorEl: false,
      new: null,
    };
  }

  handleClick = (event) => {
    this.setState({ AnchorEl: true });
  };
  handleClose = (event) => {
    this.setState({ AnchorEl: false, new: null });
  };

  handSubmit = () => {
    let rename = {
      old: this.props.chating.Speaker,
      new: this.state.new,
    };
    this.props.renamed(rename);
    this.setState({
      AnchorEl: false,
      new: null,
    });
  };

  setName = (e) => {
    // e.target.value is the text from our input
    this.setState({
      new: e.target.value,
    });
  };
  render() {
    return (
      <div className={styles.chatBox}>
        <div className={styles.ChatTopName}>
          <AccountCircleIcon className={styles.userIco} />
          <b>
            Speaker{' '}
            {this.state.AnchorEl ? (
              <span>
                <TextField
                  id='outlined-basic'
                  label='Name'
                  variant='outlined'
                  size='small'
                  onChange={(e) => this.setName(e)}
                />
                <ButtonGroup
                  disableElevation
                  variant='contained'
                  color='primary'
                  size='small'
                >
                  <IconButton>
                    <CheckIcon onClick={this.handSubmit} />
                  </IconButton>
                  <IconButton>
                    <CloseIcon onClick={this.handleClose} />
                  </IconButton>
                </ButtonGroup>
              </span>
            ) : (
              this.props.chating.Speaker
            )}
          </b>
          <span>{this.props.chating.Start_Time}</span>
        </div>
        <div className={styles.chatTopMenu}>
          <IconButton
            color='primary'
            aria-label='upload picture'
            component='span'
            aria-haspopup='true'
            onClick={this.handleClick}
            aria-controls='simple-menu'
          >
            <MoreVertIcon />
          </IconButton>
        </div>
        <div className={styles.chatcontent}>
          {parse(this.props.chating.high_lighted)}
        </div>
      </div>
    );
  }
}
