//Imports here
import loginRoutes from './login.js';

const constructorMethod = (app) => {
  app.use('/login', loginRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;
