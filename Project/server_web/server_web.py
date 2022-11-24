import socket
import os
import threading
import gzip
import json

def ProcessClient(clientsocket):
	print('S-a conectat un client.')
	# se proceseaza cererea si se citeste prima linie de text
	cerere = ''
	linieDeStart = ''
	while True:
		data = clientsocket.recv(1024)
		cerere = cerere + data.decode()
		print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
		pozitie = cerere.find('\r\n')
		if (pozitie > -1):
			linieDeStart = cerere[0:pozitie]
			print('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
			break
	print ('S-a terminat cititrea.')



	# interpretarea sirului de caractere `linieDeStart` pentru a extrage numele resursei cerute
	elem = linieDeStart.split(' ')

	if elem[0] == "POST" and elem[1] == "/api/utilizatori":
		startIndex = cerere.find('{')
		stopIndex = cerere.find('}')+1
		word =""
		for i in range(startIndex,stopIndex):
			word+=cerere[i]
		print(word)

		payload = json.loads(word)
		f = open("../continut/resurse/utilizatori.json", 'r')
		input = f.read()
		f.close()

		print(input)
		input = input.replace("]", ",")
		print(input)
		input = input + word + "]"
		print(input)

		f = open("../continut/resurse/utilizatori.json", 'w')

		f.write(input)

		clientsocket.sendall('HTTP/1.1 200 OK\r\n'.encode("UTF-8"))



	resursaCeruta = elem[1]
	numeFisier = '../continut'+ resursaCeruta
	fisier = None
	try:
		# deschide fisierul pentru citire in mod binar
		fisier = open(numeFisier,'rb')

		# tip media
		numeExtensie = numeFisier[numeFisier.rfind('.')+1:]
		tipuriMedia = {
			'html': 'text/html; charset=utf-8',
			'css': 'text/css; charset=utf-',
			'js': 'text/javascript; charset=utf-8',
			'png': 'image/png',
			'jpg': 'image/jpeg',
			'jpeg': 'image/jpeg',
			'gif': 'image/gif',
			'ico': 'image/x-icon',
			'xml': 'application/xml; charset=utf-8',
			'json': 'application/json; charset=utf-8'
			
		}
		tipMedia = tipuriMedia.get(numeExtensie,'text/plain; charset=utf-8')
		
		# citire din fisier pentru a calcula marimea(content-length)
		buf = fisier.read(1024)
		buffer = buf
		while buf:
			buf = fisier.read(1024)
			buffer += buf
		gzipBuffer = gzip.compress(buffer)

		# se trimite raspunsul
		clientsocket.sendall('HTTP/1.1 200 OK\r\n'.encode("UTF-8"))
		clientsocket.sendall(('Content-Length: ' + str(len(gzipBuffer)) + '\r\n').encode("UTF-8"))
		clientsocket.sendall(('Content-Type: ' + tipMedia +'\r\n').encode("UTF-8"))
		clientsocket.sendall(('Content-Encoding: gzip' + '\r\n').encode("utf-8"))
		clientsocket.sendall('Server: My PW Server\r\n'.encode("UTF-8"))
		clientsocket.sendall('\r\n'.encode("UTF-8"))
		
		# trimit la server continutul compresat
		clientsocket.send(gzipBuffer)



	except IOError:
		# daca fisierul nu exista trebuie trimis un mesaj de 404 Not Found
		msg = 'Eroare! Resursa ceruta ' + resursaCeruta + ' nu a putut fi gasita!'
		print(msg)
		clientsocket.sendall('HTTP/1.1 404 Not Found\r\n'.encode("UTF-8"))
		clientsocket.sendall(('Content-Length: ' + str(len(msg.encode('utf-8'))) + '\r\n').encode("UTF-8"))
		clientsocket.sendall('Content-Type: text/plain; charset=utf-8\r\n'.encode("UTF-8"))
		clientsocket.sendall('Server: My PW Server\r\n'.encode("UTF-8"))
		clientsocket.sendall('\r\n'.encode("UTF-8"))
		clientsocket.sendall(msg.encode("UTF-8"))

	finally:
		if fisier is not None:
			fisier.close()
	clientsocket.close()
	print('S-a terminat comunicarea cu clientul.')

	# trimiterea răspunsului HTTP
	clientsocket.close()
	print('S-a terminat comunicarea cu clientul.')
	

# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
serversocket.bind(('', 5678))
# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
serversocket.listen(5)

while True:
	print('#########################################################################')
	print('Serverul asculta potentiali clienti.')
	# asteapta conectarea unui client la server
	# metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
	(clientsocket, address) = serversocket.accept()

	clientThread = threading.Thread(target = ProcessClient, args = (clientsocket,))
	clientThread.start()

	