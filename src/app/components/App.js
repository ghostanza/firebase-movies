import React from 'react';
import firebase from 'helpers/firebase';
import * as moviedb from 'helpers/moviedb';
import TopBar from 'components/page-elements/TopBar';
import MyStuff from 'components/page/MyStuff';
import Dashboard from 'components/page/Dashboard';
import SearchResults from 'components/page/SearchResults';

export default class App extends React.Component {
  constructor(p){
    super(p);
    this.state = {
      isSignedIn: false,
      user: '',
      isSearching: false,
      searchResults: [],
      searchTerm: '',
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
  toggleSearching(onOff){
    this.setState((p) => ({...p, isSearching: onOff}));
  }
  searchResults(results, term) {
    this.setState((p) => ({...p, searchResults: results, searchTerm: term}));
  }
  componentWillMount(){
    moviedb.test();
  }
  render() {
    return(
      <div className='main-container'>
        <TopBar
          isSignedIn={this.state.isSignedIn}
          signIn={this.signIn.bind(this)}
          signOut={this.signOut.bind(this)}
          userName={this.state.user.displayName || ''}
          toggleSearching={this.toggleSearching.bind(this)}
          updateSearchResults={this.searchResults.bind(this)}
          />
        {this.state.user && !this.state.isSearching ? (<Dashboard user={this.state.user} firebase={firebase}/>) : this.state.user ? (<SearchResults results={this.state.searchResults} term={this.state.searchTerm}/>) : 'CLICK TO LOG IN'}
      </div>
    );
  }
}
