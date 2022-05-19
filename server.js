const app = require('./app');
const { port } = require('./config');

app.set('port', port);

const server = app.listen(app.get('port'), () => {
    console.log(`Listening on ${ server.address().port }`);
});