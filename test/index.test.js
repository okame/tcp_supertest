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

describe('something processing server', function() {
    var server = net.createServer();

    server.on('connection', function(socket) {
        socket.on('data', function(data) {
            socket.write(data+'hoge');
        });
    });

    it('should return same message', function(done) {
        request(server).write('piyo').onData(function(data) {
            data.toString().should.be.equal('piyohoge');
            done();
        }).end();
    });

});

describe('something processing server ver2', function() {
    var server = net.createServer();

    server.on('connection', function(socket) {
        socket.on('data', function(data) {
            var byte = data[0];
            socket.write(new Buffer([byte >> 4]));
        });
    });

    it('should return same message', function(done) {
        var msg = new Buffer([0x10]);
        request(server).write(msg).onData(function(data) {
            var res = data[0];
            res.should.be.equal(1);
            done();
        }).end();
    });

});

