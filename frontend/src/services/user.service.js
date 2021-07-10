import axios from 'axios';
import authHeader from './auth-header';

//const API_URL = "http://localhost:5000/api/test/"; // use for local testing
const API_URL = "https://gym-worm.herokuapp.com/api/test/"; // use when deploying to heroku

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() })
      .then((res) => {
        console.log(res);
        localStorage.setItem("access", "Admin");
      },
      (err) => {
        console.log(err);
        localStorage.setItem("access", "User");
      });
  }
}

export default new UserService();