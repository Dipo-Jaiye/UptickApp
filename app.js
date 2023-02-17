const app = require("express")();
const routes = require("./routes");
const db = require("./db");

app.use(routes);

app.listen("3000", () => console.log(`App running on port ${3000}`));