import axios from "axios";

const deployTo = "heroku" // change between "local" or "heroku"
const API_URL = (deployTo === "heroku") ? "https://gym-worm.herokuapp.com/api/slot/" : "http://localhost:5000/api/slot/";

class SlotService {
    async createSlot(date, startTime, capacity) {
        return await axios
            .post(API_URL + "createSlot", {
                date,
                startTime,
                capacity
            })
            .then(response => {
                return response.data;
            });
    }

    async updateSlot(slotID, date, startTime, capacity, fullCapacity) {
        return await axios
            .put(API_URL + "updateSlot", {
                slotID,
                date,
                startTime,
                capacity,
                fullCapacity,
            })
            .then(response => {
                return response.data;
            });
    }

    async fetchSlots(currentDate) {
        return await axios
            .post(API_URL + "fetchSlots", {
                currentDate
            })
            .then(response => {
                if (response.data.getSlots) {
                    localStorage.setItem(JSON.stringify(currentDate), JSON.stringify(response.data.getSlots));
                }
                return response.data;
            });
    }

    getCurrentSlots(currentDate) {
        return JSON.parse(localStorage.getItem(JSON.stringify(currentDate)));
    }

    clearCurrentSlots(currentDate) {
        localStorage.removeItem(JSON.stringify(currentDate));
    }

    async bookSlot(slotID, userID, userEmail) { // use this command -> SlotService.bookSlot(currentSlot.id, currentUser.id, currentUser.email)
        await axios.post(API_URL + "bookSlot", {
            slotID,
            userID,
            userEmail
        })
            .then((response) => {
                console.log("response from bookslot");
                console.log(response.data);
                return response.data;
            },
                (error) => {
                    console.log("error from bookslot");
                    console.log(error);
                    return error.response.data;
                }
            )
    }

    async recordBooking(slotID, userID) {
        return await axios.post(API_URL + "recordBooking", {
            slotID,
            userID
        })
            .then(booking => {
                return booking.data;
            })
    }

    async cancelledBooking(slotID, userID) {
        return await axios.put(API_URL + "cancelledBooking", {
            slotID,
            userID
        })
            .then(booking => {
                return booking.data;
            })
    }

    async retrieveSlot(bookingID) {
        return await axios
            .get(API_URL + "retrieveSlot", {
                bookingID
            })
            .then(response => {
                return response.data;
            });
    }

    async getSlotSettings() {
        return await axios
            .get(API_URL + "getSlotSetting", {})
            .then(response => {
                return response.data;
            })
    }

    async updateSlotSetting(startTime, endTime, capacity) {
        console.log(startTime + " " + endTime + " " + capacity);
        return await axios
            .put(API_URL + "updateSlotSetting", {
                startTime,
                endTime,
                capacity,
            })
            .then(response => {
                return response.data;
            });
    }
}

export default new SlotService();