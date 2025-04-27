const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const meeting = await MeetingHistory.create(req.body);
        res.status(201).json({ success: true, data: meeting });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding new meeting..." });
      }
}

const index = async (req, res) => {
    try {
      const meetings = await MeetingHistory.find({ deleted: false }).sort({ dateTime: -1 });
      res.status(200).json({ success: true, data: meetings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error fetching meetings..." });
    }
  }
  

const view = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findById(req.params.id);

        if (!meeting || meeting.deleted) {
            return res.status(404).json({ success: false, message: "Meeting not found" });
        }

        res.status(200).json({ success: true, data: meeting });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

const deleteData = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findById(req.params.id);

        if (!meeting || meeting.deleted) {
            return res.status(404).json({ success: false, message: "Meeting not found or already deleted" });
        }

        meeting.deleted = true;
        await meeting.save();

        res.status(200).json({ success: true, message: "Meeting deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body; // expecting an array of IDs

        await MeetingHistory.updateMany(
            { _id: { $in: ids } },
            { $set: { deleted: true } }
        );

        res.status(200).json({ success: true, message: "Meetings deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

module.exports = { add, index, view, deleteData, deleteMany }