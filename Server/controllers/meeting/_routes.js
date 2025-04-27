const express = require('express');

const router = express.Router();
const meetingController = require('./meeting');

// POST /api/meeting/add
router.post('/add', meetingController.add);

// GET /api/meeting/
router.get('/', meetingController.index);

// GET /api/meeting/view/:id
router.get('/view/:id', meetingController.view);

// DELETE /api/meeting/delete/:id
router.delete('/delete/:id', meetingController.deleteData);

// POST /api/meeting/deleteMany
router.post('/deleteMany', meetingController.deleteMany);

module.exports = router