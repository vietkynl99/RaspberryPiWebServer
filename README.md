# Raspberry Pi Web Server

Chương trình điều khiển các thiết bị đơn giản từ xa bằng Raspberry Pi thông qua 
giao diện điều khiển web.

## Yêu cầu hệ thống

Sử dụng PHP, mysql, NodeJs Express trên Raspberry Pi:

	$ sudo apt install nodejs
	$ sudo apt install npm

## Tính năng

Người dùng sử dụng web từ máy tính hoặc điện thoại kết nối tới server trên
Raspberry Pi. Sử dụng giao diên web để gửi thông tin điều khiển tới server. Server
sử dụng mysql làm cơ sở dữ liệu để lưu trữ thông tin của các thiết bị.

## Cài đặt và sử dụng

1. Tải xuống project:

	$ git clone https://github.com/vietkynl99/RaspberryPiWebServer.git

2. Cài đặt những module cần thiết cho hệ thống:

	$ npm install

3. Tạo database cho hệ thống:

	$ cd database
	$ node createDatabase.js

5. Khởi chạy server:

    $ node ./app.js

6. Truy cập trên trình duyệt:

    Mở trình duyêt và điền địa chỉ của server trên thanh địa chỉ, ví dụ: http://192.168.1.7 hoặc http://raspberrypi.
    
    Trong đó "192.168.1.7" là địa chỉ ip của raspberry pi trong mạng.