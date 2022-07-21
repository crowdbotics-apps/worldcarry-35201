import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip = (s.getsockname()[0])
host_address = 'http://{}:4444/wd/hub'.format(ip)
print(host_address)