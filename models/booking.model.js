const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    slot: { type: Schema.Types.ObjectId, ref: 'Slot', required: true },
    dateOfBooking: { type: Date, required: true },
    valid: { type: Boolean, required: true, default: true }
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;