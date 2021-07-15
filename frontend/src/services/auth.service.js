import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/"; // use for local testing
//const API_URL = "https://gym-worm.herokuapp.com/api/auth/"; // use when deploying to heroku


class AuthService {
  async login(email, password) {
    return await axios
      .post(API_URL + "signin", {
        email,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("access", "User");
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.clear();
  }

  async updateInfo(firstName, lastName, email, contactNo, roles) {
    return await axios
      .put(API_URL + 'update', {
        firstName,
        lastName,
        email,
        contactNo,
        roles
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      },
        (error) => {
          return error.response.data;
        }
      )
  }

  async updateBooking(email, bookingID) {
    return await axios
      .put(API_URL + 'update', {
        email,
        bookingID
      })
      .then(response => {
        return response.data;
      })
  }

  async cancelBooking(email, slotID) {
    return await axios
      .put(API_URL + 'cancelBooking', {
        email,
        slotID
      })
      .then(response => {
        return response.data;
      })
  }

  register(firstName, lastName, email, password, contactNo) {
    return axios
      .post(API_URL + "signup", {
        firstName,
        lastName,
        email,
        password,
        contactNo
      })
      .then(response => {
        return response.data;
      })
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }

  async updateCurrentUser(email, password) {
    return await axios
      .post(API_URL + "updateSignin", {
        email,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        //return response.data;
      });
  }

  async updateEmailNotifications(email, emailNotification) {
    return await axios
      .put(API_URL + 'update', {
        email,
        emailNotification
      })
      .then(response => {
        return response.data;
      })
  }

  async updateSMSNotifications(email, contactNotification) {
    return await axios
      .put(API_URL + 'update', {
        email,
        contactNotification
      })
      .then(response => {
        return response.data;
      })
  }

  async updateTelegramNotifications(email, telegramNotification) {
    return await axios
      .put(API_URL + 'update', {
        email,
        telegramNotification
      })
      .then(response => {
        return response.data;
      })
  }
}

export default new AuthService();