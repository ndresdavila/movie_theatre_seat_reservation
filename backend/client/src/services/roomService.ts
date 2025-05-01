import axios from 'axios';

export const getAllRooms = () => axios.get('http://localhost:5000/api/Room');
