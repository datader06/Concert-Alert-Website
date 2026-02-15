const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/auth');

// All notification routes are protected
router.get('/', authMiddleware, notificationController.getNotifications);
router.put('/:notificationId/read', authMiddleware, notificationController.markAsRead);
router.put('/mark-all-read', authMiddleware, notificationController.markAllAsRead);
router.delete('/:notificationId', authMiddleware, notificationController.deleteNotification);

module.exports = router;
