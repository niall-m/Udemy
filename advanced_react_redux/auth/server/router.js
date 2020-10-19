module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.send(['cheerios', 'tv', 'dogs']);
  });
}