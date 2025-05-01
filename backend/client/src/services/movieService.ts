import axios from 'axios';

export const getAllMovies = () => axios.get('http://localhost:5096/api/Movie');
