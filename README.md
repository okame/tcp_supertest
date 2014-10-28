tcp_supertest
=============

TCP-SUPERTEST is a test helper for tcp server based on nodejs.

h2. example

```

var request = require('../index'),
    net = require('net');

describe('echo server', function() {
    var server = net.createServer();
    server.on('connection', function(socket) {
        socket.on('data', function(data) {
            socket.write(data);
        });
    });

    it('should return same message', function(done) {
        request(server).write('hoge').onData(function(data) {
            data.toString().should.be.equal('hoge');
            done();
        }).end();
    });
});

```
