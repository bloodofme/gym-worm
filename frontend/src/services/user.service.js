import axios from 'axios';
import authHeader from './auth-header';
import Deployment from "../DeploymentMethod"

const deployTo = Deployment() // change between "local" or "heroku"
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
        sessionStorage.setItem("access", "Admin");
      },
      (err) => {
        //console.log(err);
        sessionStorage.setItem("access", "User");
      });
  }
}

export default new UserService();