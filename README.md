# Rabbit Encryption Demo
This is a demo/sample application to show an example of how messages between producer and consumer of a specific queue can be encrypted. And then imply that it will be encrypted at rest as well.

## Context
I have always wondered about payloads/messages being posted to a Rabbit Queue, being unencrypted. I worried about rogue consumers of that queue or someone with access to the RabbitMQ Admin portal, who can see these. There are different mechanisms that can be put in place to further secure these messages: Implementing TLS (), not sending sensitive information in these payloads, and then the third option I am demonstrating here: encrypting the payloads/messages manually.

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


### Consumer


### Story


#### References (and big thanks to)
https://www.architect.io/blog/2021-01-19/rabbitmq-docker-tutorial/
