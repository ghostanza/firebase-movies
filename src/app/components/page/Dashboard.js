import React from 'react';
import * as moviedb from 'helpers/moviedb';
import {db} from 'helpers/firebase';

export default class Dashboard extends React.Component {
  constructor(p){
    super(p);
    this.state = {
      library: [],
      movieData: [],
    }
  }
  componentDidMount(){
    db(`users/${this.props.user.uid}/library`).orderByChild('added_desc').on('value', (movies) => {
      if(movies){
        let movieIDs = [],
            lib = {},
            movieData = [];
        movies.forEach((movie) => {
          movieIDs.push(movie.key);
          lib[movie.key] = movie.val();
        });
        this.setState((p)=>({...p, library: lib}));
        moviedb.getInfoMulti(movieIDs).then((res) => {
          res.forEach((d) => {
            if(d.data){
              let tmp = d.data;
              if(tmp.poster_path){
                tmp.image_src = moviedb.createPosterURL(tmp.poster_path, 'medium');
              }
              movieData.push(tmp);
            }
          });
          this.setState((p) => ({...p, movieData}));
        });
      }
    });
  }
  componentWillUnmount(){
    // to avoid trying to update the state when it unmounts
    db(`users/${this.props.user.uid}/library`).off('value');
  }

  render() {
    let { movieData, library } = this.state;
    return(
      <div className='dashboard'>
        { Object.keys(library).length && movieData.length && Object.keys(library).length == movieData.length ? (
          <ul>
            {movieData.map((movie) => {
              return (
                <li key={movie.id}>
                  {movie.image_src ? (<img src={movie.image_src}/>) : (<div className='placeholder'>No Image</div>)}
                  <p>{movie.title || ''}</p>
                  {library[movie.id].added ? (<p>Added on {new Date(library[movie.id].added).toLocaleDateString()}</p>): ''}
                </li>)
            })}
          </ul>
        ) : (<p>No Items In Your Library</p>)}
      </div>
    )
  }
}
