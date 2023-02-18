module.exports = {
    errorHandler: (err, req, res, next) => {
        let errStatusCode = err.statusCode ?? 400;
        let errJson = {
            error: true,
            message: err.message ?? "Unknown error",
        };

        return res.status(errStatusCode).json(errJson);
    },

    healthCheck: (req, res) => {
        return res.status(200).json({ error: false, message: "working" });
    },

    routeNotFound: (req, res) => {
        return res.status(404).json({ error: true, message: "route not found" });
    },
};