# Raspberry Pi : Web Server

Chương trình điều khiển các thiết bị đơn giản từ xa bằng Raspberry Pi thông qua 
giao diện điều khiển web.

## Cài đặt và sử dụng

Tải chương trình xuống và bỏ vào thư mục /var/www/html. Có thể sử dụng git command

	$ cd /var/www/html
	$ git clone https://github.com/vietkynl99/RaspberryPiWebServer.git

Chú ý và thư mục "www" thuộc quền của root nên các bạn phải sử dụng quền root để copy hoặc chuyển thư mục này sang quyền user thông thường :

	$ cd /var
	$ sudo chown -R pi:pi www

Trong đó owner:goup là pi: pi. Có thể raspberry của ban đang dùng owner và group khác. Hãy kiểm tra nhóm của mình bằng lệnh : groups.


Mở tệp sql/sql-function.php lên và sửa 2 dòng sau :

-	define("userName", "root") thành define("userName", "tên khi bạn cài đặt
mysql, mặc định là root").

-	define("password", "password") thành define("password", "mật khẩu khi
cài đặt mysql ứng với tên bên trên").

Tạo database cho các thiết bị. Gõ lệnh trên terminal : 

	$ php sql.php

Chương trình sẽ tạo ra những ví dụ về những thiết bị điều khiển đơn giản mà 
chương trình hỗ trợ. Hãy thử điều khiển với những thiết bị đó trước khi tạo 
thiết bị của riêng mình.	

Tạo master điều khiển. Truy cập thư mục master và biên dịch master :

	$ make

Điều khiển bằng trình duyệt :

Mở trình duyêt và điền địa chỉ của server trên thanh địa chỉ, ví dụ : 
raspberrypi/lazy (hoặc 192.168.1.23/lazy). Trong đó "192.168.1.23" là địa chỉ ip của raspberry trong mạng,
"lazy" là tên thư mục của chương trình.

Chạy chương trình master trên terminal :

	$ ./server-thread