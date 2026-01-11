BuildPC 

Kiểm tra tương thích giữa các sản phẩm bắt buộc
Khi builcPC, hệ thống tạo 1 mảng rỗng checkCompatibility chứa tối da 5 phần tử: {CPU, Mainboard, RAM, GPU, Case}
Khi chọn 1 trong các sản phẩm thuộc danh mục: CPU, Mainboard, RAM, GPU, Case
Thì thêm sản phẩm đó vào vị trí tương ứng trong mảng checkCompatibility 
{
    CPU -> 00 
    Mainboard -> 01
    RAM -> 02
    GPU -> 03
    Case -> 04 
}
User có thể chọn bất kì sản phẩm nào, không theo thứ tự, chỉ kiểm tra tương thích khi mảng có 2 sản phẩm thỏa điều kiện 
Khi có từ 2 sản phẩm trở lên và các sản phẩm đó thỏa yêu cầu dưới 
Kiểm tra: 
1. CPU ↔ Mainboard → Thuộc tính Socket ( CPU theo socket.giá trị = Socket Hỗ Trợ.giá trị)
2. CPU ↔ RAM → Thuộc tính DDR type (Loại RAM.giá trị)
(
    Note: Hiện tại CPU chưa có thuộc tính Loại RAM 
            Hệ thống tự convert dựa trên CPU theo Socket: 
            - LGA 1200 (10th): DDR4
            - LGA 1700 (12th, 13th, 14th) : DDR4, DDR5
            - LGA 1851 (Core Ultra): DDR5
            - AM4 (3000, 5000): DDR4
            - AM5 (7000, 9000): DDR5

)
3. RAM ↔ Mainboard → DDR type (Loại RAM.giá trị = Loại RAM Hỗ Trợ.giá trị)
4. Mainboard ↔ Case → Form Factor (Kiểu Kích Thước (Form Factor).giá trị = Kích thước Mainboard.giá trị )
5. GPU ↔ Case → GPU length (Độ dài GPU (mm).giá trị < Độ dài GPU tối đa (mm).giá trị)

Thì sẽ lần lượt kiểm tra các sản phẩm tương thích sau để hiển thị cho người dùng 

VD: 
1. User chọn CPU Intel Core I5 14600kf (Socket LGA 1700) -> Hệ thống lưu vào mảng checkCompatibility
(Intel Core I5 14600kf, Mainboard, Ram, GPU, Case)
2. Khi User chọn tiếp Mainboard -> Hệ thống check CPU - Mainboard -> Socket (Socket của CPU đã chọn LGA 1700)
3. Hiển thị danh sách Mainboard tương thích với Socket LGA 1700 
4. User chọn Mainboard Asus Tuf B760M từ danh sách -> Hệ thống lưu vào mảng 
{Intel Core I5 14600kf, Asus Tuf B760M, RAM, GPU, Case}
5. Khi User chọn tiếp RAM 
* Trường hợp User đã chọn Mainboard -> Hệ thống check Ram - Mainboard -> DDR type
* Trường hợp User đã chọn CPU -> Hệ thống check Ram - CPU -> DDR type 
* Trường hợp User chọn cả CPU + Mainboard -> hệ thống check Ram - Mainboard -> DDR type 


