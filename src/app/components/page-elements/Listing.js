import React from 'react';

export default class Listing extends React.Component {
  render() {
    let results = this.props.items;
    return(
      <div>
        <h3>SEARCH RESULTS FOR {this.props.term ? `"${this.props.term}"` : '""'}</h3>
        {this.props.items.length ? (
          <ul>{[...results]}</ul>
        ) : (<p>No Results</p>)}
      </div>
    )
  }
}
