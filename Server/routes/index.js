//Imports here
import mealReqRoutes from './mealRequests.js';
import userRoutes from './users.js';
import orderRoutes from './order.js';
import dishRoutes from './dishes.js';
import cookRoutes from './cooks.js'
import searchRoutes from './search.js'
const constructorMethod = (app) => {
  app.use('/mealReqs', mealReqRoutes);
  app.use('/users', userRoutes);
  app.use('/orders', orderRoutes);
  app.use('/dishes', dishRoutes);
  app.use('/cooks', cookRoutes);
  app.use('/searchQuery', searchRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route Not found' });
  });
};

export default constructorMethod;

