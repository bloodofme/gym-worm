const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post("/api/auth/signin", controller.signin);

    app.put("/api/auth/update", controller.update);

    app.post("/api/auth/updateSignin", controller.updateSignin);

    app.put("/api/auth/cancelBooking", controller.cancelBooking);

    app.get("/api/auth/listEmailNotif", controller.listEmailNotif);

    app.get("/api/auth/listAllCustomers", controller.listAllCustomers);

    app.get("/api/auth/listSlotCustomers", controller.listSlotCustomers);

    app.get("/api/auth/listOneCustomer", controller.listOneCustomer);

    app.put("/api/auth/demeritUser", controller.demeritUser);

    app.get("/api/auth/teleFetchSlot", controller.teleFetchSlot);
};