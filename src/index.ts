const Server = require('./server');

async function main(){
    console.log('starting server');
    const server = new Server();
    server.start();

}
main();