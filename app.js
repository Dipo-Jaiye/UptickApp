const db = require("./db");
let app = require("express")();
const applyMiddleware = require("./middleware");
const applyRoutes = require("./routes");
const {PORT,} = process.env;

// apply middleware
app = applyMiddleware(app);

// apply routes
app = applyRoutes(app);

db()
    .then(() => {
        console.log("database connected");
        app.listen(PORT, () => console.log(`App running on port ${PORT}`));
    })
    .catch(err => {
        console.error("error connecting to database %o", err);
        process.exit(1);
    });