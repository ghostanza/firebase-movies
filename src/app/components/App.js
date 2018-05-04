import React from 'react';
import * as firebase from 'helpers/firebase';
import * as moviedb from 'helpers/moviedb';
import TopBar from 'components/page-elements/TopBar';
import MyStuff from 'components/page/MyStuff';
import Dashboard from 'components/page/Dashboard';
import SearchResults from 'components/page/SearchResults';

export default class App extends React.Component {
  constructor(p){
    super(p);
    firebase.init();
    this.state = {
      isSignedIn: false,
      user: '',
      isSearching: false,
      searchResults: [],
      searchTerm: '',
    }
    if(firebase!=undefined){
      firebase.onAuthStateChanged(this.updateSignedIn.bind(this));
    }
  }
  signIn(){
    firebase.signInWithGoogle();
  }
  signOut(){
    firebase.signOut(this.state.user.uid);
  }
  updateSignedIn(user){
    if(user){
      firebase.db(`users/${user.uid}/online`).set(true);
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
    let { user, isSearching, searchTerm, searchResults, isSignedIn } = this.state;
    return(
      <div className='main-container'>
        <TopBar
          isSignedIn={isSignedIn}
          signIn={this.signIn.bind(this)}
          signOut={this.signOut.bind(this)}
          userName={user.displayName || ''}
          toggleSearching={this.toggleSearching.bind(this)}
          updateSearchResults={this.searchResults.bind(this)}
          />
        { user && !isSearching ?
          (<Dashboard user={user}/>)
          : user ? (<SearchResults results={searchResults} term={searchTerm} uid={user.uid}/>)
          : 'CLICK TO LOG IN'}
      </div>
    );
  }
}
