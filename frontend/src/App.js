import React from 'react';
import socketio from 'socket.io-client';

var socket;

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      messages: [
        {type: 'msg', sender:'Berk',message:'Selam Millet!'},
        {type: 'msg',sender:'Murat',message:'Selam!'},
        {type: 'info',sender:'Ttest'},
        {type: 'msg',sender:'Ttest',message:'test'}
      ],
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
        this.setState({isLoggedIn : true, name: username});
        if(!socket){
          socket = socketio(`http://${this.state.staticValues.HOST}:${this.state.staticValues.WEBSOCKET_PORT}`);
          socket.emit("USER_CONNECTED", this.state.name);
        }
        this.socketListener();
      }
      else{
        this.setState({isLoggedIn : false});
      }

      
    });
  }

  socketListener = () => {
    socket.on('USER_CONNECTED' , (connectedUser) => {
      console.log('connectedUser: ' + connectedUser );
      this.setState({
        ...this.state,
        messages : [...this.state.messages , {type: 'info',sender: connectedUser}]
      });
    })
  }

  submitHandler = (event) => {
    event.preventDefault();
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

  usernameHandler = (event) => {
    this.setState({
      name: event.target.value
    });
  }

  logOut = () => {
    localStorage.clear();
    this.setState({
      name : '',
      isLoggedIn : false
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
            <button onClick={this.logOut} className="btn btn-outline-warning my-2 my-sm-0" type="submit">Log Out</button>
          </nav>
          <div className="container">
            <div style={{marginTop: '100px', marginBottom: '100px'}}>
              {this.state.messages.map( message => this.showMessages(message))}
            </div>
          </div>
          <div>
            
          </div>
        </div>
      );
    }
    else{
      return (
        <div className="container">
          <div style={{backgroundColor: 'rgba(0,0,0,0.1)', padding: 20, marginTop: '25%', marginLeft: '10%', marginRight: '10%'}}>
            <h3 style={{marginBottom: '20px'}}>Simple Chat App Login</h3>
            <form onSubmit={this.submitHandler}>
              <div className="form-group">
                <label htmlFor="email-input">Username</label>
                <input onChange={this.usernameHandler} type="text" className="form-control" id="email-input" />
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
