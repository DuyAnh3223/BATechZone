Tạo dữ liệu sql insert vào các table attributes, attribute_values, attribute_categories, categories_attributes_values tương ứng 
*attribute_categories: biết danh mục nào chứa thuộc tính nào
VD: Danh mục CPU có thuộc tính Hãng, Dòng CPU, CPU theo Socket, Thế hệ CPU
Danh mục VGA có thuộc tính Hãng, Kiểu Bộ Nhớ, Kích Thước Bộ nhớ
*categories_attributes_values: Biết danh mục nào chứa thuộc tính với giá trị cụ thể nào
VD: Danh mục CPU có thuộc tính Hãng chứa giá trị Intel, AMD
Danh mục VGA cũng có thuộc tính Hãng nhưng chứa giá trị AMD, NVIDIA, Asus, Gigabyte,MSI, không có giá trị Intel 



category_id =1/category_name = CPU:
    - Hãng: 
        - Intel 
        - AMD
    - Dòng CPU: 
        - Intel Core I3
        - Intel Core I5
        - Intel Core I7
        - AMD Ryzen 3
        - AMD Ryzen 5
        - AMD Ryzen 7 
        - Intel Core Ultra 5
        - Intel Core Ultra 7
    - CPU theo Socket:
        - LGA 1200 (10th)
        - LGA 1700 (12th, 13th, 14th)
        - LGA 1851 (Core Ultra)
        - AM4 (3000, 5000)
        - AM5 (7000, 9000)
    - Thế hệ CPU:
        - Intel Cooper Lake (10th)
        - Intel Alder Lake (12th)
        - Intel Raptor Lake ( 13th)
        - Intel Raptor Lake Refresh (14th)
        - Intel Arrow Lake (Core Ultra)
        - AMD Ryzen 3000 series
        - AMD Ryzen 5000 series
        - AMD Ryzen 7000 series
        - AMD Ryzen 9000 series

category_id =2 /category_name = VGA:
    - Hãng: 
        - NVIDIA
        - AMD
        - Asus
        - Gigabyte
        - MSI
        - Asrock 
        - Sapphire
        - Inno3D
        - Colorful
    - Nhu cầu sử dụng:
        - Gaming
        - Đồ Họa, Kiến Trúc
        - Phổ Thông, Văn Phòng
        
    - Kiểu Bộ Nhớ:
        - GDDR5
        - GDDR6
        - GDD6X
        - GDDR7
    - Kích Thước Bộ Nhớ:
        - 2GB
        - 4GB
        - 6GB
        - 8GB
        - 12GB
        - 16GB

category_id =4 /category_name = SSD: 
    - Hãng:
        - Corsair
        - Western Digital
        - Gigabyte
        - Samsung
        - Lexar
        - MSI
        - Kingston
        - PNY
        - Apacer
    - Dung Lượng:
        - 128GB
        - 256GB
        - 512GB
        - 1TB
        - 2TB
    - Loại Ổ Cứng:
        - 2.5” SATA
        - M.2 SATA
        - M.2 NVME
    - Giao diện PCIe:
        - PCIe Gen 3.0 x4
        - PCIe Gen 4.0 x4
        - PCIe Gen 5.0 x4

category_id =5 /category_name = Mainboard:
    -  Hãng
        - Intel
        - AMD
        - Asus
        - Asrock 
        - Gigabyte
        - MSI 
    - Socket Hỗ Trợ:
        - LGA 1200 (10th)
        - LGA 1700 (12th, 13th, 14th)
        - LGA 1851 (Core Ultra)
        - AM4 (3000, 5000)
        - AM5 (7000, 9000)
    - Chipset:
        - Intel H510 (LGA 1200)
        - Intel B560 (LGA 1200)
        - Intel Z590 (LGA 1200)
        - Intel H610 (LGA 1700)
        - Intel B760 (LGA 1700)
        - Intel Z790 (LGA 1700)
        - Intel B860 (LGA 1851) 
        - Intel Z890 (LGA 1851) 
        - AMD B450 (AM4)
        - AMD A520 (AM4)
        - AMD A620 (AM5)
        - AMD B650 (AM5)
        - AMD X670 (AM5)
    - Kiểu Kích Thước (Form Factor) :
        - Mini ITX
        - M-ATX
        - ATX
        - E-ATX
    - Số Khe Cắm RAM:
        - 2 khe
        - 4 khe
        - 8 khe

category_id =6 /category_name = PSU:
    - Hãng:
        - Asus
        - Corsair
        - Xigmatek
        - Gigabyte
        - Cooler Master
        - MSI 
        - Antec
    - Công Suất Nguồn:
        - 350W
        - 400W
        - 450W
        - 500W
        - 650W
        - 800W
        - 1000W
    - Chuẩn Nguồn:
        - 80 Plus
        - 80 Plus Bronze
        - 80 Plus Silver
        - 80 Plus Gold
        - 80 Plus Platinum
    - Kiểu Dây Nguồn:
        - Non Modular (Dây liền)
        - Full Modular (Dây rời)
category_id =7 /category_name = Case:
    - Hãng: 
        - Asus
        - Corsair
        - MSI
        - Segotep
        - Cougar
        - Jonsbo 
        - Cooler Master
        - Xigmatek
    - Kích Cỡ:
        - Full Tower 
        - Mid Tower
        - Mini Tower
        - Mini ITX
    - Kích thước Mainboard:
        - Mini – ITX
        - M- ATX
        - ATX
        - E-ATX

category_id =13 /category_name = HDD:
    - Hãng:
        - Western Digital
        - Seagate
        - Toshiba
    - Dung Lượng:
        - 1TB
        - 2TB
        - 4TB
        - 6TB
        - 8TB
        - 10TB
    - Tốc Độ Vòng Quay:
        - 5400 RPM
        - 7200 RPM
category_id =35 /category_name = RAM:
    - Loại RAM: 
        - DDR4
        - DDR5
    - Hãng:
        - Corsair
        - Adata
        - Kingston
        - Lexar
        - GSkill
        - TeamGroup
        - KingMax
        - PNY
    - Bus RAM: 
        - DDR4 3200 MHz 
        - DDR4 3600 MHz 
        - DDR5 6000 Mhz 
        - DDR5 5600 Mhz 
        - DDR5 6400 Mhz 
        - DDR5 5200 MHz 
    - Dung Lượng:
        - 8GB ( 1 X 8GB)
        - 16GB (1 X 16GB)
        - 16GB (2 X 8GB)
        - 32GB (1 X 32GB)
        - 32GB (2 X 16GB)
category_id =40 /category_name = Monitor:
    - Hãng:
        - Asus
        - MSI
        - Gigabyte
        - Viewsonic
        - Samsung
        - AOC
        - VSP 
        - Dell 
        - HP 
    - Tần Số Quét
        - 60 Hz 
        - 75 Hz 
        - 100 Hz 
        - 120 Hz 
        - 144 Hz 
        - 165 Hz 
        - 180 Hz 
        - 240 Hz 
        - 360 Hz 
    - Độ Phân Giải:
        - HD + (1600 * 900)
        - Full HD (1920 *1080)
        - 2K QHD (2560x1440)
        - 4K (3840x2160)
    - Tấm Nền:
        - IPS
        - VA
        - TN
    - Kích Thước:
        - 15.6 inch
        - 21.5 inch 
        - 23.8 inch
        - 24.5 inch
        - 27 inch
        - 32 inch 

