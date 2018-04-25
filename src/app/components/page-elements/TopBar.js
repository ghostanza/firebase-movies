import React from 'react';

export default class TopBar extends React.Component {
  render() {
    return(
      <div className="top-bar">
        <div className="user-name">{this.props.userName}</div>
        { this.props.isSignedIn ?
            (<div className="login-btn sign-out" onClick={this.props.signOut}>Sign Out</div>)
            : (<div className="login-btn sign in" onClick={this.props.signIn}>Sign In With Google</div>)
        }
      </div>
    )
  }
}
