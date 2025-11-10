// const express = require('express');
// const router = express.Router();
// const {
//   createItem,
//   getAllItems,
//   getItemById,
//   placeOrder,
//   updateOrderStatus,
//   getMyItems,
//   getMyOrders,
//   deleteItem,
//   addRating
// } = require('../controllers/itemController');
// const { protect } = require('../middleware/auth');

// // All routes are protected
// router.use(protect);

// // Item CRUD operations
// router.post('/', createItem);
// router.get('/', getAllItems);
// router.get('/my-items', getMyItems);
// router.get('/my-orders', getMyOrders);
// router.get('/:id', getItemById);
// router.delete('/:id', deleteItem);

// // Order operations
// router.post('/:id/order', placeOrder);
// router.put('/:id/order/:orderId', updateOrderStatus);

// // Rating operations
// router.post('/:id/rating', addRating);

// module.exports = router;
















const express = require('express');
const router = express.Router();
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,        // ADD THIS
  placeOrder,
  updateOrderStatus,
  getMyItems,
  getMyOrders,
  deleteItem,
  addRating
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Item CRUD operations
router.post('/', createItem);
router.get('/', getAllItems);
router.get('/my-items', getMyItems);
router.get('/my-orders', getMyOrders);
router.get('/:id', getItemById);
router.put('/:id', updateItem);        // ADD THIS LINE - Edit item
router.delete('/:id', deleteItem);

// Order operations
router.post('/:id/order', placeOrder);
router.put('/:id/order/:orderId', updateOrderStatus);

// Rating operations
router.post('/:id/rating', addRating);

module.exports = router;