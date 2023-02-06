# rabbitmqencryptiondemo
This is a demo/sample application to show an example of how messages between producer and consumer of a specific queue can be encrypted. And then imply that it will be encrypted at rest as well.

## Context
I have always wondered about payloads/messages being posted to a Rabbit Queue, being unencrypted. I worried about rogue consumers of that queue or someone with access to the RabbitMQ Admin portal, who can see these. There are different mechanisms that can be put in place to further secure these messages: Implementing TLS (), not sending sensitive information in these payloads, and then the third option I am demonstrating here: encrypting the payloads/messages manually.

### Prerequisite
You will need a RabbitMQ instance running. See RabbitMQ Docker section a little later.
NodeJS for the producer.
Python3 for the consumer.
