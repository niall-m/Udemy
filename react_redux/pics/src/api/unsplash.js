import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: 'Client-ID 8YiLsq-YALArGedDo3MWQdJXI9QOIp05uBndDQDLedY'
  }
});