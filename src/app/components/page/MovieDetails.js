import React from 'react';
import {db} from 'helpers/firebase';

export default class MovieDetails extends React.Component {
  constructor(p){
    super(p);
    this.state = {
      existingData: ''
    }
    db(`users/${p.uid}/library/${p.data.id}`).on('value', (snapshot) => {
      if(snapshot.val()){
        this.setState((p) => ({...p, existingData: snapshot.val()}));
      }
    });
  }
  addToLibrary(e){
    if([...e.target.classList].includes('loading')){
      return;
    }
    else{
      e.target.classList.add('loading');
      let added = new Date();
      added = added.getTime();
      let added_desc = 0 - added;
      db(`users/${this.props.uid}/library/${this.props.data.id}`).set({added, added_desc});
    }
  }
  render() {
    let data = this.props.data;
    return(
      <div>
      {
        data ? (
          <div>
            {data.image_src ? (<img src={data.image_src}/>) : ''}
            <h2>{data.title || ''}</h2>
            {data.formatted_release_date ? (<p>{data.formatted_release_date.string}</p>) : ''}
            {data.overview ? (<p>{data.overview}</p>) : ''}
            {!this.state.existingData ? (<div onClick={this.addToLibrary.bind(this)}>Check In</div>) : (<div>Added on: {this.state.existingData.added}</div>)}
            <div onClick={this.props.back}>Back</div>
          </div>
        ) : (<p>Could not find data</p>)
      }
      </div>
    )
  }
}
