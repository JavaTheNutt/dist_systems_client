import axios from 'axios';

const http = axios.create({
  baseUrl: 'http://localhost:3000/',
  auth: {
    username: 'joe.bloggs@test.com',
    password: 'pa$$w0rd'
  }
});

export default http;
