import React from 'react';
import firebase from 'helpers/firebase';
import TopBar from 'components/page-elements/TopBar';
import MyStuff from 'components/page/MyStuff';

export default class App extends React.Component {
  constructor(p){
    super(p);
    this.state = {
      isSignedIn: false,
      user: ''
    }
    if(firebase!=undefined){
      firebase.auth().onAuthStateChanged(this.updateSignedIn.bind(this))
    }
  }
  signIn(){
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({prompt: 'select_account'});
    firebase.auth().signInWithPopup(provider);
  }
  signOut(){
    firebase.auth().signOut();
  }
  updateSignedIn(user){
    if(user){
      this.setState((p) => ({...p, isSignedIn: true, user}));
    } else{
      this.setState((p) => ({...p, isSignedIn: false, user: ''}));
    }
  }
  render() {
    return(
      <div className='main-container'>
        <TopBar
          isSignedIn={this.state.isSignedIn}
          signIn={this.signIn.bind(this)}
          signOut={this.signOut.bind(this)}
          userName={this.state.user.displayName || ''}
          />
        {this.state.user ? (<MyStuff user={this.state.user} firebase={firebase}/>) : ''}
      </div>
    );
  }
}
