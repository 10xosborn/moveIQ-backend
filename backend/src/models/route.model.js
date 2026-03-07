const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true // Prevents duplicate road names
  },
  area: { 
    type: String, 
    required: true 
  },
  junctions: [{ 
    type: String 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Route', routeSchema);