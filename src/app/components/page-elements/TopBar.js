import React from 'react';
import Search from 'components/page-elements/Search';

export default class TopBar extends React.Component {
  render() {
    return(
      <div className="top-bar">
        {this.props.isSignedIn ? (<Search toggleSearching={this.props.toggleSearching} updateSearchResults={this.props.updateSearchResults}/>) : ''}
        <div className="user-name">{this.props.userName}</div>
        { this.props.isSignedIn ?
            (<div className="login-btn sign-out" onClick={this.props.signOut}>Sign Out</div>)
            : (<div className="login-btn sign in" onClick={this.props.signIn}>Sign In With Google</div>)
        }
      </div>
    )
  }
}
