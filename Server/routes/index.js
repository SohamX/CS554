//Imports here
import mealReqRoutes from './mealRequests.js';
//import commentRoutes from './comments.js';

const constructorMethod = (app) => {
  app.use('/mealReqs', mealReqRoutes);
  

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;

