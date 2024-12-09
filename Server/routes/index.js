//Imports here
import mealReqRoutes from './mealRequests.js';
//import commentRoutes from './comments.js';
import cookRoutes from './cooks.js'

const constructorMethod = (app) => {
  app.use('/mealReqs', mealReqRoutes);
  app.use('/cook', cookRoutes);
  

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;

