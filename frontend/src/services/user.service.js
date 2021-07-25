import axios from 'axios';
import authHeader from './auth-header';

const deployTo = "heroku" // change between "local" or "heroku"
const API_URL = (deployTo === "heroku") ? "https://gym-worm.herokuapp.com/api/test/" : "http://localhost:5000/api/test/";

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
        //console.log(res);
        localStorage.setItem("access", "Admin");
      },
      (err) => {
        //console.log(err);
        localStorage.setItem("access", "User");
      });
  }
}

export default new UserService();