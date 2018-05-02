import React from 'react';

export default class MovieDetails extends React.Component {
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
            <div onClick={this.props.back}>Back</div>
          </div>
        ) : (<p>Could not find data</p>)
      }
      </div>
    )
  }
}
