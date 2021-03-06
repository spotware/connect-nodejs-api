'use strict';

var GuaranteedCommand = require('./guaranteed_command');

var GuaranteedCommands = function (params) {
    this.state = params.state;
    this.send = params.send;
    this.openCommands = [];
};

GuaranteedCommands.prototype.create = function (params) {
    var
        command = new GuaranteedCommand(params),
        send = this.send;

    this.openCommands.push(command);

    this.state.isConnected()
        ? send(command.payload)
        : null;

    return command.promise;
};

GuaranteedCommands.prototype.resend = function () {
    this.openCommands.forEach(function (command) {
        this.send(command.payload);
    }, this);
};

GuaranteedCommands.prototype.extract = function (clientMsgId) {
    var openCommands = this.openCommands;
    var openCommandsLength = openCommands.length;
    var command;
    var index = 0;

    while (index < openCommandsLength) {
        command = openCommands[index];
        if (command.clientMsgId === clientMsgId) {
            openCommands.splice(index, 1);
            return command;
        }
        index += 1;
    }
};

module.exports = GuaranteedCommands;
