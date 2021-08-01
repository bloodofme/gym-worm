import axios from "axios";
import Deployment from "../DeploymentMethod"

const deployTo = Deployment() // change between "local" or "heroku"
const API_URL = (deployTo === "heroku") ? "https://gym-worm.herokuapp.com/api/auth/" : "http://localhost:5000/api/auth/";

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

  async updateInfo(firstName, lastName, email, contactNo, roles, telegramHandle) {
    return await axios
      .put(API_URL + 'update', {
        firstName,
        lastName,
        email,
        contactNo,
        roles,
        telegramHandle
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

  register(firstName, lastName, email, password, contactNo, telegramHandle) {
    return axios
      .post(API_URL + "signup", {
        firstName,
        lastName,
        email,
        password,
        contactNo,
        telegramHandle
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

  listEmailNotif() {
    return axios
      .get(API_URL + 'listEmailNotif', {})
      .then((response) => {
        return response.data;
      })
  }

  listAllCustomers() {
    return axios
      .get(API_URL + 'listAllCustomers', {})
      .then((response) => {
        return response.data;
      })
  }

  listSlotCustomers(userID) {
    return axios
      .post(API_URL + 'listSlotCustomers', { userID })
      .then((response) => {
        return response.data;
      })
  }

  listOneCustomer(userID) {
    return axios
      .get(API_URL + 'listOneCustomer', { userID })
      .then((response) => {
        return response.data;
      })
  }

  async demeritUser(userID) {
    return await axios
      .put(API_URL + 'demeritUser', {
        userID
      })
      .then(response => {
        return response.data;
      })
  }

  async teleFetchSlot(telegramHandle) {
    return await axios
      .get(API_URL + 'teleFetchSlot', { telegramHandle })
      .then((response) => {
        return response.data;
      })
  }

  async resetPasswordReq(email) {
    return await axios
      .put(API_URL + 'resetPasswordReq', {
        email,
      })
      .then((response) => {
        return response.data;
      },
        (error) => {
          return error.response.data;
        }
      )
  }

  async changePasswordSet(email, tempPassword, newPassword) {
    return await axios
      .put(API_URL + 'changePasswordSet', {
        email,
        tempPassword,
        newPassword
      })
      .then((response) => {
        return response.data;
      },
        (error) => {
          return error.response.data;
        }
      )
  }
}

export default new AuthService();