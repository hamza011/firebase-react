import React, { Component } from 'react';
import fire from './firebase';
import firebase from 'firebase';
// import logo from './logo.svg';
import checked from './checked.png';
import './App.css';

class App1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      successFlag: false
    }; // <- set up react state
    this.readData();

    this.deleteAll = this.deleteAll.bind(this);
  }

  componentWillMount() {
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('/messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let message = { text: snapshot.val(), id: snapshot.key };
      this.setState({
        messages: [message].concat(this.state.messages)
        // messages: [message]
      });
    });
  }

  readData() {
    // firebase.database().ref('/').once('value', function (snapshot) {
    firebase.database().ref('/messages').on('value', function (snapshot) {
      if (snapshot.val()) {
        snapshot.forEach(data => {
          // console.log('data : ', data.val());
        })
      }
      else {
        console.log('Kindly add some data first!')
      }
    });
  }

  addMessage(event) {
    event.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    fire.database().ref('/messages').push(this.inputEl.value);
    this.inputEl.value = ''; // <- clear the input

    this.setState({ successFlag: this.state.successFlag = true });

    setTimeout(() => {
      this.setState({ successFlag: this.state.successFlag = false });
    }, 2000);
  }

  deleteItem(id) {

    // console.log('Id : ', id)
    firebase.database().ref('/messages/' + id).remove();

    this.setState({
      messages: this.state.messages.filter((item) => {
        // console.log("item ===> ", item);
        // console.log("id ===> ", id);
        return item.id !== id
      }),
    });
  }

  deleteAll() {
    firebase.database().ref('/messages').remove();
    this.setState({
      messages: []
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.addMessage.bind(this)} className="form">
          <input className="inpField" type="text" ref={el => this.inputEl = el} required />
          <input className="submit" type="submit" />
        </form>
        <ul>
          { /* Render the list of messages */
            this.state.messages.map(message =>
              <li key={message.id}>
                {message.text}
                <button className="delBtn" onClick={this.deleteItem.bind(this, message.id)}>Delete</button>
              </li>
            )
          }
        </ul>
        {
          this.state.messages && this.state.messages.length ?
            <div> <button className="deleteAllBtn" onClick={this.deleteAll}>Delete All</button> </div> :
            <div></div>
        }

        {
          this.state.successFlag === true ?
            <div className="notification"> <img src={checked} alt='tick-mark-icon' /> Added Successfully </div> :
            <div></div>
        }

      </div>
    );
  }
}

export default App1;
