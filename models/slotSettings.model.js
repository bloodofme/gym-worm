const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const slotSettingSchema = new Schema({
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    capacity: { type: Number, required: true, minlength: 0 },
}, {
    timestamps: true,
});

const SlotSetting = mongoose.model('SlotSetting', slotSettingSchema);

module.exports = SlotSetting;