# Rabbit Encryption Demo
This is a demo/sample application to show an example of how messages between producer and consumer of a specific queue can be encrypted. And then imply that it will be encrypted at rest as well.

## Context
I have always wondered about payloads/messages being posted to a Rabbit Queue, being unencrypted. I worried about rogue consumers of that queue or someone with access to the RabbitMQ Admin portal, who can see these. There are different mechanisms that can be put in place to further secure these messages: 
- Implementing TLS between producers and consumers
- Not sending sensitive information in these payloads
- third option I am demonstrating here: encrypting the payloads/messages manually.

### Prerequisite
You will need a RabbitMQ instance running. See RabbitMQ Docker section below.

NodeJS for the producer.

Python3 for the consumer.

### Docker (for this example)
You will need to pull the latest RabbitMQ image which includes the management console. Do this by executing the following command in terminal.

`docker pull rabbitmq:3-management`

To run this image that you have just pulled, run the docker run command exposing the required ports by executing the following command in terminal.

`docker run --rm -it -p 15672:15672 -p 5672:5672 rabbitmq:3-management`

For this really basic and default RabbitMQ image the admin console can be accessed going to the following link once the container is running: http://localhost:15672 and logging in using the following credentials for authentication, username (guest), and password (guest). 

### Producer
The producer is a NodeJS implementation of a simple example html form which submits a message to an ExpressJS endpoint. This message is then posted to RabbitMQ using the standard amqplib callback api.

The form has a toggle to switch encryption on and off. When encryption is toggled on (checked), then a passphrase is required. After succesful posting of a message to ExpressJS and RabbitMQ a feedback prompt is displayed on the sample html page.

The encryption method used is syncronous encryption. This is not the 'safest' way, but for the intent and demonstration of this example, it was the quickest and simplest mechanism to use. Syncronous encryption means that the same passphrase/secret is used to encrypt and decrypt a given input. The cipher algorithm used is AES which requires a passphrase of 32 characters length.

A quick passphrase can be generated here (remember to change the length to 32 characters): https://1password.com/password-generator/ (I have found that sometimes with certain symbols the encryption doesnt work. So only use alphanumeric characters.

Before the passphrased is used, it is converted to bytes and then those bytes to hex. This is important, because this hex value is the one which is used by the consumer to decrypt.

An important factor to consider is that in practise the method in which this secret/passphrase is shared would also need to be secure. Something like a vault or secrets manager need to be used.

### Consumer
The consumer is a Python3 implementation of a simple listener to the specific queue. The application takes in a run time argument boolean of true or false, and this toggles on and off whether the consumer should attempt to decrypt the message payload received.

The hex value of the passphrase should be provided to this consumer if the parameter that was parsed at runtime was true. The python code will then be able to decrypt the message payload using the standard Crypto.Cipher library. The hex value of the iv should also be parsed prior to executing the consumer.

### Story


#### References (and big thanks to)
- https://www.architect.io/blog/2021-01-19/rabbitmq-docker-tutorial/
- https://github.com/tchapi/markdown-cheatsheet/blob/master/README.md
