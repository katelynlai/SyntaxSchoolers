const express = require('express');
const cors = require('cors');
const staffRoutes = require('./routers/staffRoutes.js');

const app = express();

app.use(cors());
app.use(express.json());

// Mount all staff routes at /api/staff
app.use('/api/staff', staffRoutes);

module.exports = app;
