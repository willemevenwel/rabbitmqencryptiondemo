import sys
import pika
from Crypto.Cipher import AES
import binascii

isEncryptionOn=False

host = 'localhost'
queue = 'security-guild-demo'

def on_message(ch, method, properties, body):

    message = body.decode('UTF-8')

    if isEncryptionOn is False:
        print('--------------------------------------------------')
        print(" Message received         : " + message)
        print('--------------------------------------------------')
    else:
        print(' Encrypted message received: ' + message)
        print(' Decrypting...') 
        decrypted = decrypt('56666952366e58546963663835303052515465485743596f5966546e38737145', '61616161616161616161616161616161', message)
        print('--------------------------------------------------')
        print(" Decrypted message        : " + decrypted.decode().strip())
        print('--------------------------------------------------')

def decrypt(key, iv, encrypted_data):
    key = binascii.unhexlify(key)
    iv = binascii.unhexlify(iv)
    encrypted_data = binascii.unhexlify(encrypted_data)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return cipher.decrypt(encrypted_data)
 
def main():

    print('')
    print('')
    print('--------------------------------------------------')
    print(' Welcome to the Rabbit Consumer written in Python')
    print('--------------------------------------------------')
    print('')
    print('')
    print(' FOR DEMO PURPOSES ONLY: Number of arguments : ', len(sys.argv), 'arguments.')
    print(' FOR DEMO PURPOSES ONLY: Argument List       : ', str(sys.argv))
    print(' FOR DEMO PURPOSES ONLY: First argument      : ', str(sys.argv[1]))
    print('')

    if sys.argv[1]=='true':
        global isEncryptionOn #gaan lees oor global
        isEncryptionOn=True
        print(' FOR DEMO PURPOSES ONLY: Encryption is on: ', isEncryptionOn)
        print('')

    connection_params = pika.ConnectionParameters(host=host)
    connection = pika.BlockingConnection(connection_params)
    channel = connection.channel()

    channel.queue_declare(queue=queue)

    channel.basic_consume(queue=queue, on_message_callback=on_message, auto_ack=True)

    print('Subscribed to ' + queue + ', waiting for messages...')

    channel.start_consuming()

if __name__ == '__main__':
    main()