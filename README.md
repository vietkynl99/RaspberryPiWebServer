# Raspberry Pi Web Server

Chương trình điều khiển các thiết bị đơn giản từ xa bằng Raspberry Pi thông qua 
giao diện điều khiển web.

## Yêu cầu hệ thống

Sử dụng Apache, PHP, mysql, C++ trên Raspberry Pi

## Tính năng

Người dùng sử dụng web từ máy tính hoặc điện thoại kết nối tới server trên
Raspberry Pi. Sử dụng giao diên web để gửi thông tin điều khiển tới server. Server
sử dụng mysql làm cơ sở dữ liệu để lưu trữ thông tin của các thiết bị.

## Cài đặt và sử dụng

1. Tải xuống chương trình:

	$ git clone https://github.com/vietkynl99/RaspberryPiWebServer.git

2. Mở tệp sql/sqlAdapter.php lên và sửa các thông tin về: serverName, userName, password, dbName, TABLE

3. Tạo database cho hệ thống : 

	$ ./autorun.sh -c (hoặc ./autorun.sh --createdb)

4. Chạy chương trình copy html vào Apache:

	$ ./autorun.sh

5. Khởi chạy server:

    Trong lần chạy đầu tiên:

	$ ./autorun.sh -r (hoặc ./autorun.sh --rebuildserver)

    Trong lần chạy thứ 2 trở đi:

	$ ./autorun.sh -s (hoặc ./autorun.sh --startserver)

6. Truy cập trên trình duyệt

    Mở trình duyêt và điền địa chỉ của server trên thanh địa chỉ, ví dụ: http://192.168.1.7 hoặc http://raspberrypi.
    
    Trong đó "192.168.1.7" là địa chỉ ip của raspberry pi trong mạng.