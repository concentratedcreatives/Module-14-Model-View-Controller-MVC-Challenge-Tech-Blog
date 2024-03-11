const router = require('express').Router();
const homeRoutes = require('./home-routes.js');
const dashboardRoutes = require('./dashboard-routes.js');
const apiRoutes = require('./api');

// Mount home routes
router.use('/', homeRoutes);

// Mount dashboard routes
router.use('/dashboard', dashboardRoutes);

// Mount API routes
router.use('/api', apiRoutes);

// Handle 404 error
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
