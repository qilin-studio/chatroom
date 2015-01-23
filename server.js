var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat', function (err, db) {
    if (err) throw err;

    client.on('connection', function (socket) {
        console.log('Someone has connected.');

        var col = db.collection('messages');
        var sendStatus = function(statusMsg){
                socket.emit('status', statusMsg);
            };

        socket.on('input', function (data) {
            console.log(data);
            var name = data.name,
                message = data.message;
            whitespacePattern = /^\s*$/;

            if(whitespacePattern.test(name) || whitespacePattern.test(message)) {
                console.log('Invalid');
                sendStatus("Message and name are both required.");
            } 
            else {
                col.insert({name: name, message: message}, function(){
                    sendStatus({
                        message: "Message sent",
                        clear: true
                    });
                
                });
            }
        });
    });
});