/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', {title: 'Express'});
};
exports.login = function (req, res) {
    res.render('login');
};
exports.logout = function (req, res) {
    res.render('logout');
};
exports.register = function (req, res) {
    res.render('register');
};
exports.blog = function (req, res) {
    res.render('blog');
};