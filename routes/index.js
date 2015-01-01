/*
 * GET home page.
 */
module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render('index');
    });
    app.get('/login', function (req, res) {
        res.render('login');
    });
    app.get('/register', function (req, res) {
        res.render('register');
    });
    app.get('/logout', function (req, res) {
        res.render('logout');
    });
    app.get('/blog', function (req, res) {
        res.render('blog');
    });
};