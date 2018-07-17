var app = require('./app');

var port = 8000;

app.listen(port, function() {
    console.log('Server listen on port ' + port);
})