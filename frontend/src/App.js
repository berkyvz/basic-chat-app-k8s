import React from 'react';
import socketio from 'socket.io-client';

var socket;

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      messages: [
      ],
      message: '',
      name: '',
      staticValues: {},
      isLoggedIn: false,
    }
  }

  componentWillMount(){
    fetch('http://localhost:5000/staticvalues').then(resp => resp.json()).then(data => {
      this.setState({
        staticValues : data
      });

      const username = localStorage.getItem('username');
      if(username){
        this.setState({name: username});
        if(!socket){
          socket = socketio(`http://${this.state.staticValues.HOST}:${this.state.staticValues.WEBSOCKET_PORT}`);
          socket.emit("USER_CONNECTED", this.state.name);
        }
        this.socketListener();
        this.setState({isLoggedIn : true});
      }
      else{
        this.setState({isLoggedIn : false});
      }

      
    });
  }

  socketListener = () => {
    socket.on('USER_CONNECTED' , (connectedUser) => {
      this.setState({
        ...this.state,
        messages : [...this.state.messages , {type: 'info',sender: connectedUser}]
      });
    });
    socket.on('MESSAGE' , (obj) => {
      this.setState({
        ...this.state,
        messages : [...this.state.messages , {type: 'msg',sender: obj.sender, message: obj.message}]
      });
    });
  }

  submitHandler = (event) => {
    event.preventDefault();
    if(event.target.name.toString() === 'login'){
      if( this.state.name.length < 3){
        alert('Name must be equal or longer than 3 characters.')
        return;
      }
      socket = socketio(`http://${this.state.staticValues.HOST}:${this.state.staticValues.WEBSOCKET_PORT}`);
      socket.emit("USER_CONNECTED", this.state.name);
      localStorage.setItem('username', this.state.name);
      this.setState({
        isLoggedIn: true
      });
    }
    if(event.target.name.toString() === 'message'){
      const obj = {
        type:'msg',
        sender: localStorage.getItem("username"),
        message: this.state.message
      };
      console.log(obj);
      socket.emit("MESSAGE" , obj);
      this.setState({
        message : ''
      });
    }

  }

  usernameHandler = (event) => {

    if(event.target.name === 'message-input'){
      this.setState({
        message: event.target.value
      });
    }
    else { // login-input
      this.setState({
        name: event.target.value
      });

    }

    
    
  }

  logOut = () => {
    localStorage.clear();
    this.setState({
      messages: [
      ],
      message: '',
      name: '',
      staticValues: {},
      isLoggedIn: false,
    });
    socket.disconnect();
  }

  showMessages = (message) => {
    if( message.type === 'msg'){
      return (
        <div class="alert alert-secondary">
          <span style={{fontWeight: 800}}>{`${message.sender}:`}</span>
          <span>{`    ${message.message}`}</span>
        </div>
      );
    }
    else {
      return (
        <div className="alert alert-success" >
          <span style={{fontWeight: 800}}>
            {`${message.sender} connected`}
          </span>
        </div>
      );
    }
  }

  render() {
    if(localStorage.getItem('username')) {
      return (
        <div>
          <nav className="navbar navbar-dark bg-dark">
            <span className="navbar-brand mb-0 h1">You Logged In as <span style= {{color: "yellow"}}>{localStorage.getItem('username')}</span></span>
            <button onClick={this.logOut} className="btn btn-outline-warning my-3 my-sm-0" type="submit">Log Out</button>
          </nav>
          <div className="container">
            <div style={{marginTop: '100px', marginBottom: '100px'}}>
              {this.state.messages.map( message => this.showMessages(message))}
            </div>
          </div >
          <div className="container-fluid">
            <form  onSubmit={this.submitHandler} name="message" class="form-inline">
              <div class="form-group mx-sm-3 mb-2">
                <input type="text" value={this.state.message} class="form-control" name='message-input' onChange={this.usernameHandler} placeholder="Message..." />
              </div>
              
              <button type="submit" class="btn btn-primary mb-2">SEND</button>
            </form>
          </div>
        </div>
      );
    }
    else{
      return (
        <div className="container">
          <div style={{backgroundColor: 'rgba(0,0,0,0.1)', padding: 20, marginTop: '25%', marginLeft: '10%', marginRight: '10%'}}>
            <h3 style={{marginBottom: '20px'}}>Simple Chat App Login</h3>
            <form name="login" onSubmit={this.submitHandler}>
              <div className="form-group">
                <label htmlFor="email-input">Username</label>
                <input onChange={this.usernameHandler} name="login-input" type="text" className="form-control" id="email-input" />
              </div>
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      );
    }
    
  }
}

export default App;
