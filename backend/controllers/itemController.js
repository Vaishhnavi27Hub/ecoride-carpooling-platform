// const Item = require('../models/Item');
// const User = require('../models/User');

// // @desc    Create a new item listing
// // @route   POST /api/items
// // @access  Private
// exports.createItem = async (req, res) => {
//   try {
//     const {
//       trip,
//       itemDetails,
//       location,
//       pricing,
//       quantity,
//       delivery,
//       expiryDate,
//       tags
//     } = req.body;

//     if (!itemDetails || !location || !pricing || !quantity || !delivery || !expiryDate) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide all required fields'
//       });
//     }

//     const item = await Item.create({
//       seller: req.user._id,
//       trip,
//       itemDetails,
//       location,
//       pricing,
//       quantity,
//       delivery,
//       expiryDate,
//       tags: tags || []
//     });

//     await item.populate('seller', 'name email phone profilePicture rating');

//     res.status(201).json({
//       success: true,
//       message: 'Item listed successfully',
//       item
//     });
//   } catch (error) {
//     console.error('Create item error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating item',
//       error: error.message
//     });
//   }
// };

// // @desc    Get all items
// // @route   GET /api/items
// // @access  Private
// exports.getAllItems = async (req, res) => {
//   try {
//     const { status, category } = req.query;

//     let query = {};

//     if (status) {
//       query.status = status;
//     } else {
//       query.status = 'available';
//     }

//     if (category) {
//       query['itemDetails.category'] = category;
//     }

//     // Show only non-expired items
//     query.expiryDate = { $gte: new Date() };

//     const items = await Item.find(query)
//       .populate('seller', 'name email phone profilePicture rating department')
//       .populate('trip', 'title destination')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: items.length,
//       items
//     });
//   } catch (error) {
//     console.error('Get items error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching items',
//       error: error.message
//     });
//   }
// };

// // @desc    Get single item
// // @route   GET /api/items/:id
// // @access  Private
// exports.getItemById = async (req, res) => {
//   try {
//     const item = await Item.findById(req.params.id)
//       .populate('seller', 'name email phone profilePicture rating department employeeId')
//       .populate('trip', 'title destination schedule')
//       .populate('orders.buyer', 'name email phone profilePicture')
//       .populate('ratings.user', 'name profilePicture');

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       item
//     });
//   } catch (error) {
//     console.error('Get item error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching item',
//       error: error.message
//     });
//   }
// };

// // @desc    Place order for item
// // @route   POST /api/items/:id/order
// // @access  Private
// exports.placeOrder = async (req, res) => {
//   try {
//     const { quantity, deliveryNotes } = req.body;

//     if (!quantity || quantity < 1) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide valid quantity'
//       });
//     }

//     const item = await Item.findById(req.params.id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     // Check if seller
//     if (item.seller.toString() === req.user._id.toString()) {
//       return res.status(400).json({
//         success: false,
//         message: 'You cannot order your own item'
//       });
//     }

//     // Check availability
//     const remainingQuantity = item.quantity.available - item.quantity.sold;
//     if (quantity > remainingQuantity) {
//       return res.status(400).json({
//         success: false,
//         message: `Only ${remainingQuantity} items available`
//       });
//     }

//     // Check if already ordered
//     const alreadyOrdered = item.orders.some(
//       o => o.buyer.toString() === req.user._id.toString() && o.status !== 'cancelled'
//     );

//     if (alreadyOrdered) {
//       return res.status(400).json({
//         success: false,
//         message: 'You have already placed an order for this item'
//       });
//     }

//     const totalAmount = item.pricing.totalPrice * quantity;

//     item.orders.push({
//       buyer: req.user._id,
//       quantity,
//       totalAmount,
//       deliveryNotes
//     });

//     item.quantity.sold += quantity;

//     await item.save();
//     await item.populate('orders.buyer', 'name email phone profilePicture');

//     res.status(200).json({
//       success: true,
//       message: 'Order placed successfully',
//       item
//     });
//   } catch (error) {
//     console.error('Place order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error placing order',
//       error: error.message
//     });
//   }
// };

// // @desc    Update order status
// // @route   PUT /api/items/:id/order/:orderId
// // @access  Private (Seller only)
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!['confirmed', 'delivered', 'cancelled'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status'
//       });
//     }

//     const item = await Item.findById(req.params.id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     if (item.seller.toString() !== req.user._id.toString()) {
//         return res.status(403).json({
//         success: false,
//         message: 'Only the seller can update order status'
//       });
//     }

//     const order = item.orders.id(req.params.orderId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     order.status = status;

//     // If cancelled, return quantity
//     if (status === 'cancelled') {
//       item.quantity.sold -= order.quantity;
//     }

//     await item.save();
//     await item.populate('orders.buyer', 'name email phone profilePicture');

//     res.status(200).json({
//       success: true,
//       message: `Order ${status} successfully`,
//       item
//     });
//   } catch (error) {
//     console.error('Update order error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating order',
//       error: error.message
//     });
//   }
// };

// // @desc    Get my items (as seller)
// // @route   GET /api/items/my-items
// // @access  Private
// exports.getMyItems = async (req, res) => {
//   try {
//     const items = await Item.find({ seller: req.user._id })
//       .populate('trip', 'title destination')
//       .populate('orders.buyer', 'name email phone profilePicture')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: items.length,
//       items
//     });
//   } catch (error) {
//     console.error('Get my items error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching items',
//       error: error.message
//     });
//   }
// };

// // @desc    Get my orders (as buyer)
// // @route   GET /api/items/my-orders
// // @access  Private
// exports.getMyOrders = async (req, res) => {
//   try {
//     const items = await Item.find({ 'orders.buyer': req.user._id })
//       .populate('seller', 'name email phone profilePicture rating')
//       .populate('trip', 'title destination');

//     // Filter to only show user's orders
//     const myOrders = items.map(item => {
//       const userOrders = item.orders.filter(
//         order => order.buyer.toString() === req.user._id.toString()
//       );
      
//       return {
//         item: {
//           _id: item._id,
//           itemDetails: item.itemDetails,
//           pricing: item.pricing,
//           delivery: item.delivery,
//           seller: item.seller,
//           trip: item.trip
//         },
//         orders: userOrders
//       };
//     });

//     res.status(200).json({
//       success: true,
//       count: myOrders.length,
//       orders: myOrders
//     });
//   } catch (error) {
//     console.error('Get my orders error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching orders',
//       error: error.message
//     });
//   }
// };

// // @desc    Delete item
// // @route   DELETE /api/items/:id
// // @access  Private (Seller only)
// exports.deleteItem = async (req, res) => {
//   try {
//     const item = await Item.findById(req.params.id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     if (item.seller.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Only the seller can delete the item'
//       });
//     }

//     // Check if there are pending orders
//     const hasPendingOrders = item.orders.some(
//       order => order.status === 'pending' || order.status === 'confirmed'
//     );

//     if (hasPendingOrders) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot delete item with pending orders'
//       });
//     }

//     item.status = 'cancelled';
//     await item.save();

//     res.status(200).json({
//       success: true,
//       message: 'Item deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete item error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting item',
//       error: error.message
//     });
//   }
// };

// // @desc    Add rating to item
// // @route   POST /api/items/:id/rating
// // @access  Private
// exports.addRating = async (req, res) => {
//   try {
//     const { rating, comment } = req.body;

//     if (!rating || rating < 1 || rating > 5) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide a valid rating (1-5)'
//       });
//     }

//     const item = await Item.findById(req.params.id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     // Check if user ordered the item
//     const hasOrdered = item.orders.some(
//       o => o.buyer.toString() === req.user._id.toString() && o.status === 'delivered'
//     );

//     if (!hasOrdered) {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only rate items you have received'
//       });
//     }

//     // Check if already rated
//     const alreadyRated = item.ratings.some(
//       r => r.user.toString() === req.user._id.toString()
//     );

//     if (alreadyRated) {
//       return res.status(400).json({
//         success: false,
//         message: 'You have already rated this item'
//       });
//     }

//     item.ratings.push({
//       user: req.user._id,
//       rating,
//       comment
//     });

//     item.calculateAverageRating();
//     await item.save();

//     await item.populate('ratings.user', 'name profilePicture');

//     res.status(200).json({
//       success: true,
//       message: 'Rating added successfully',
//       item
//     });
//   } catch (error) {
//     console.error('Add rating error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error adding rating',
//       error: error.message
//     });
//   }
// };























const Item = require('../models/Item');
const User = require('../models/User');

// @desc    Create a new item listing
// @route   POST /api/items
// @access  Private
exports.createItem = async (req, res) => {
  try {
    const {
      trip,
      itemDetails,
      location,
      pricing,
      quantity,
      delivery,
      expiryDate,
      tags
    } = req.body;

    if (!itemDetails || !location || !pricing || !quantity || !delivery || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const item = await Item.create({
      seller: req.user._id,
      trip,
      itemDetails,
      location,
      pricing,
      quantity,
      delivery,
      expiryDate,
      tags: tags || []
    });

    await item.populate('seller', 'name email phone profilePicture rating');

    res.status(201).json({
      success: true,
      message: 'Item listed successfully',
      item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: error.message
    });
  }
};

// @desc    Get all items
// @route   GET /api/items
// @access  Private
exports.getAllItems = async (req, res) => {
  try {
    const { status, category } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'available';
    }

    if (category) {
      query['itemDetails.category'] = category;
    }

    // Show only non-expired items
    query.expiryDate = { $gte: new Date() };

    const items = await Item.find(query)
      .populate('seller', 'name email phone profilePicture rating department')
      .populate('trip', 'title destination')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: error.message
    });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Private
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'name email phone profilePicture rating department employeeId')
      .populate('trip', 'title destination schedule')
      .populate('orders.buyer', 'name email phone profilePicture')
      .populate('ratings.user', 'name profilePicture');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      item
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching item',
      error: error.message
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (Seller only)
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is the seller
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the seller can update the item'
      });
    }

    const {
      itemDetails,
      location,
      pricing,
      quantity,
      delivery,
      expiryDate,
      tags
    } = req.body;

    // Update fields
    if (itemDetails) item.itemDetails = itemDetails;
    if (location) item.location = location;
    if (pricing) item.pricing = pricing;
    if (quantity) {
      // Keep the sold count, only update available
      item.quantity.available = quantity.available;
    }
    if (delivery) item.delivery = delivery;
    if (expiryDate) item.expiryDate = expiryDate;
    if (tags) item.tags = tags;

    // Update availability status based on quantity
    const remainingQuantity = item.quantity.available - item.quantity.sold;
    if (remainingQuantity <= 0) {
      item.status = 'sold_out';
    } else if (item.status === 'sold_out') {
      item.status = 'available';
    }

    await item.save();
    await item.populate('seller', 'name email phone profilePicture rating');

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: error.message
    });
  }
};

// @desc    Place order for item
// @route   POST /api/items/:id/order
// @access  Private
exports.placeOrder = async (req, res) => {
  try {
    const { quantity, deliveryNotes } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid quantity'
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if seller
    if (item.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot order your own item'
      });
    }

    // Check availability
    const remainingQuantity = item.quantity.available - item.quantity.sold;
    if (quantity > remainingQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${remainingQuantity} items available`
      });
    }

    // Check if already ordered
    const alreadyOrdered = item.orders.some(
      o => o.buyer.toString() === req.user._id.toString() && o.status !== 'cancelled'
    );

    if (alreadyOrdered) {
      return res.status(400).json({
        success: false,
        message: 'You have already placed an order for this item'
      });
    }

    const totalAmount = item.pricing.totalPrice * quantity;

    item.orders.push({
      buyer: req.user._id,
      quantity,
      totalAmount,
      deliveryNotes
    });

    item.quantity.sold += quantity;

    await item.save();
    await item.populate('orders.buyer', 'name email phone profilePicture');

    res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      item
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/items/:id/order/:orderId
// @access  Private (Seller only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['confirmed', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.seller.toString() !== req.user._id.toString()) {
        return res.status(403).json({
        success: false,
        message: 'Only the seller can update order status'
      });
    }

    const order = item.orders.id(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;

    // If cancelled, return quantity
    if (status === 'cancelled') {
      item.quantity.sold -= order.quantity;
    }

    await item.save();
    await item.populate('orders.buyer', 'name email phone profilePicture');

    res.status(200).json({
      success: true,
      message: `Order ${status} successfully`,
      item
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

// @desc    Get my items (as seller)
// @route   GET /api/items/my-items
// @access  Private
exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user._id })
      .populate('trip', 'title destination')
      .populate('orders.buyer', 'name email phone profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: error.message
    });
  }
};

// @desc    Get my orders (as buyer)
// @route   GET /api/items/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const items = await Item.find({ 'orders.buyer': req.user._id })
      .populate('seller', 'name email phone profilePicture rating')
      .populate('trip', 'title destination');

    // Filter to only show user's orders
    const myOrders = items.map(item => {
      const userOrders = item.orders.filter(
        order => order.buyer.toString() === req.user._id.toString()
      );
      
      return {
        item: {
          _id: item._id,
          itemDetails: item.itemDetails,
          pricing: item.pricing,
          delivery: item.delivery,
          seller: item.seller,
          trip: item.trip
        },
        orders: userOrders
      };
    });

    res.status(200).json({
      success: true,
      count: myOrders.length,
      orders: myOrders
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (Seller only)
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the seller can delete the item'
      });
    }

    // Check if there are pending orders
    const hasPendingOrders = item.orders.some(
      order => order.status === 'pending' || order.status === 'confirmed'
    );

    if (hasPendingOrders) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete item with pending orders'
      });
    }

    // ✅ ACTUALLY DELETE from database instead of just marking cancelled
    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message
    });
  }
};

// @desc    Add rating to item
// @route   POST /api/items/:id/rating
// @access  Private
exports.addRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating (1-5)'
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user ordered the item
    const hasOrdered = item.orders.some(
      o => o.buyer.toString() === req.user._id.toString() && o.status === 'delivered'
    );

    if (!hasOrdered) {
      return res.status(403).json({
        success: false,
        message: 'You can only rate items you have received'
      });
    }

    // Check if already rated
    const alreadyRated = item.ratings.some(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyRated) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this item'
      });
    }

    item.ratings.push({
      user: req.user._id,
      rating,
      comment
    });

    item.calculateAverageRating();
    await item.save();

    await item.populate('ratings.user', 'name profilePicture');

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      item
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding rating',
      error: error.message
    });
  }
};