import React, { Component } from 'react';
import fire from './firebase';
import firebase from 'firebase';
import checked from './checked.png';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.readData();
  }

  componentWillMount() {
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('/messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let message = { text: snapshot.val(), id: snapshot.key };
      console.log("message", message)
      this.setState({
        messages: [message].concat(this.state.messages)
        // messages: [message, ...this.state.messages]
        // ["12", "w2", "32", "dsa"]
      });
    });
  }

  addMessage(event) {
    event.preventDefault();
    fire.database().ref('/messages').push(this.inputEl.value);
    // fire.database().ref('/todo').set(this.inputEl.value);
    this.inputEl.value = '';
  }

  readData() {
    // firebase.database().ref('/').once('value', function (snapshot) {
    firebase.database().ref('/messages').on('value', function (snapshot) {
      console.log('data : ', snapshot.val());
    });
  }


  delete(id) {
    console.log("ID : ", id);
    firebase.database().ref('/messages/' + id).remove();

    this.setState({
      messages:
        this.state.messages.filter((message) => {
          return message.id != id;
        })
    })

  }

  delAll(){
    firebase.database().ref('/messages').remove();
    this.setState({messages : []});
  }

  render() {
    return (
      <div>
        <form onSubmit={this.addMessage.bind(this)}>
          <input className="inpField" type="text" ref={el => this.inputEl = el} required />
          <input className="submit" type="submit" />
        </form>
        <ul>
          {
            this.state.messages.map(message =>
              <li key={message.id}>
                {message.text}
                <button onClick={this.delete.bind(this, message.id)} >Delete</button>
              </li>
            )
          }
        </ul>
        <button onClick={this.delAll.bind(this)}>DELETE ALL</button>
      </div>
    );
  }
}

export default App;
