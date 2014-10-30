/* LIBS */
var deferred = require('deferred');
var net = require('net');
var __ = require('underscore');

/* Constants */
var DEFAULT = {
    PORT: 20000,
    HOST: '127.0.0.1'
};

var port_buffer = DEFAULT.PORT;

/* Request Class */
function TcpSuperTest(server, port) {
    this.port = port;
    this.host = DEFAULT.HOST;

    this.server = server;
    this.server.listen(this.port, this.host);
    //console.log('Starting Test Tcp Server. Port: '+this.port+' Host: '+this.host);

}

function write(data) {
    this.written_message = data;
    return this;
}

function onData(callback) {
    this.data_handler = callback;
    return this;
}

function end() {
    var self = this;

    this.server.on('listening', function() {
        var client = net.connect(self.port, self.host);
        //console.log('Connecting to Test Tcp Server. Port: '+self.port+' Host: '+self.host);

        if(self.written_message) {
            client.write(self.written_message);
        }

        if(self.data_handler) {
            client.on('data', function(data) {
                self.data_handler(data);
                self.server.close();
                client.end();
            });
        } else {
            client.end();
            self.server.close();
        }

    });

}

TcpSuperTest.fn = TcpSuperTest.prototype;
TcpSuperTest.fn.write = write;
TcpSuperTest.fn.onData = onData;
TcpSuperTest.fn.end = end;

/* Manager */
function request(server) {
    var clone_server = net.createServer();

    clone_server._events = __.clone(server._events);

    return new TcpSuperTest(clone_server, ++port_buffer);
}

module.exports = request;
