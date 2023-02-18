const userRoutes = require("./userRoutes");
const noteRoutes = require("./noteRoutes");
const { protect, } = require("../controllers/userController");
const {healthCheck, errorHandler, routeNotFound,} = require("../controllers/homeController");

module.exports = (app) => {
    app.get("/", healthCheck);
    app.use("/api/v1/user", userRoutes);
    app.use("/api/v1/note", protect, noteRoutes);
    app.use(routeNotFound);
    app.use(errorHandler);
    return app;
}