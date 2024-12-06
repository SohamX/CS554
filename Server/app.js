import express from 'express';
import cors from 'cors';
import session from 'express-session';
const app = express();
import configRoutes from './routes/index.js';
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);
app.use(
  session({
    name: 'AuthenticationState',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false
  })
);


//MIDDLEWARES



configRoutes(app);

app.listen(3000, () => {
  //checkDbConnection();
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});