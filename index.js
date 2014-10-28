/* LIBS */
var deferred = require('deferred');
var net = require('net');

/* Constants */
var DEFAULT = {
    PORT: 10000,
    HOST: '127.0.0.1'
};

/* Request Class */
function TcpSuperTest(server) {
    this.port = DEFAULT.PORT;
    this.host = DEFAULT.HOST;

    this.server = server;
    this.server.listen(this.port, this.host);

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

        if(self.written_message) {
            client.write(self.written_message);
        }

        if(self.data_handler) {
            client.on('data', function(data) {
                self.data_handler(data);
                self.server.close();
            });
        } else {
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
    return new TcpSuperTest(server);
}

module.exports = request;
