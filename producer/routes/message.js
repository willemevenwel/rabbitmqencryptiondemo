const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
//const symetricKey = crypto.randomBytes(32);
//const iv = crypto.randomBytes(16);
//const symetricKey = new Buffer.from("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"); //32 length
const iv = new Buffer.from("aaaaaaaaaaaaaaaa"); //16 length

function encryptString(text, symetricKey) {
    let cipher = crypto.createCipheriv(algorithm, symetricKey, iv);
    let encrypted = cipher.update(text, 'UTF-8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

function decryptString(encryptedObject, symetricKey) {
  let iv = new Buffer.from(encryptedObject.iv, 'hex');
  let encryptedData = new Buffer.from(encryptedObject.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, symetricKey, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'UTF-8');
  decrypted += decipher.final('UTF-8');
  return decrypted;
}

var express = require('express');
var router = express.Router();

var amqp = require('amqplib/callback_api');

const url = 'amqp://localhost';
const queue = 'security-guild-demo';

let channel = null;
amqp.connect(url, function (err, conn) {
  if (!conn) {
    throw new Error(`AMQP connection not available on ${url}`);
  }
  conn.createChannel(function (err, ch) {
    channel = ch;
  });
});

process.on('exit', code => {
    channel.close();
    console.log(`Closing`);
});

router.post('/', function (req, res, next) {

  let message = req.body.message == undefined || req.body.message == '' ? null : req.body.message
  let encrypt = req.body.encrypt == undefined  || req.body.encrypt == '' ? 'false' : req.body.encrypt == 'true'
  let passphrase = req.body.passphrase == undefined || req.body.passphrase == ''  ? null : req.body.passphrase

  if (message != null) {

    if (encrypt === true) {
        
      if (passphrase == null) {

        res.render('index', { response: `You have not supplied a passphrase!`});

      } else {
      
        var symetricKeyLocal = new Buffer.from(passphrase); //must be 32 characters long
        var encrypted = encryptString(message, Buffer.from(passphrase, 'UTF-8'));
        console.log("--------------------------------------------------------------------------------")
        console.log(" Encrypted text: "+encrypted.encryptedData);
        console.log(" FOR DEMO PURPOSES ONLY: Encrypted iv: "+encrypted.iv);
        console.log(" FOR DEMO PURPOSES ONLY: Encryption symetric key: " + symetricKeyLocal.toString('hex'));

        console.log(" FOR DEMO PURPOSES ONLY: Decrypting it on sender side: " + decryptString(encrypted, symetricKeyLocal));
        console.log("--------------------------------------------------------------------------------")

        channel.sendToQueue(queue, new Buffer.from(encrypted.encryptedData));

      }

    } else {

      console.log("--------------------------------------------------------------------------------")
      console.log(" Message: "+ message);
      console.log("--------------------------------------------------------------------------------")
      channel.sendToQueue(queue, new Buffer.from(message));

    }
  
    let logmessage = `Successfully sent: ${message}, ${encrypt}, ${passphrase}`
    console.log(logmessage)

    res.render('index', { response: logmessage});
    
  } else {

    res.render('index', { response: `Message was null and not sent to rabbitmq!`});

  }

});

module.exports = router;

