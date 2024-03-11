const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dbConnection = require('./config/connection');
const routes = require('./controllers');
const viewHelpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

const sessionConfig = {
    secret: process.env.DB_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: dbConnection,
        checkExpirationInterval: 1000 * 60 * 10,
    })
};

const handlebarsInstance = exphbs.create({ helpers: viewHelpers });

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

dbConnection.sync();

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});
