import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Cpu,
  Filter,
  PlusCircle,
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
} from "lucide-react";

const mockCatalog = {
  cpu: [
    {
      id: "cpu-intel-core-i5-14600kf",
      variantId: 336,
      sku: "intel-core-i5-14600kf-default",
      name: "CPU Intel Core i5-14600KF (up to 5.3GHz, 14 nhân 20 luồng, 24MB Cache)",
      brand: "Intel",
      socket: "LGA1700",
      generation: "Raptor Lake",
      price: 4500000,
      stock: 59,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/80?text=CPU",
      description:
        "Mẫu CPU đang bán tại B.A Tech Zone với 14 nhân hiệu năng cao, phù hợp gaming và làm việc.",
      highlights: ["14 nhân / 20 luồng", "Turbo 5.3GHz", "TDP 125W"],
    },
    {
      id: "cpu-amd-ryzen-5-3400g",
      variantId: 9991,
      sku: "cpu-amd-ryzen-5-3400g",
      name: "CPU AMD Ryzen 5 3400G (3.7GHz Upto 4.2GHz, 4C/8T, Radeon Vega 11)",
      brand: "AMD",
      socket: "AM4",
      generation: "Ryzen 3000",
      price: 1799000,
      stock: 24,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/80?text=CPU",
      description:
        "APU tích hợp Radeon Vega 11, phù hợp các cấu hình văn phòng hoặc gaming eSports.",
      highlights: ["iGPU Vega 11", "65W TDP", "Unlocked"],
    },
  ],
  mainboard: [
    {
      id: "mb-asus-b760m-e-tuf",
      variantId: 338,
      sku: "asus-b760m-e-tuf-default",
      name: "Mainboard ASUS B760M-E TUF Gaming WiFi",
      brand: "ASUS",
      socket: "LGA1700",
      chipset: "Intel B760",
      form: "mATX",
      price: 6999000,
      stock: 20,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/80?text=MB",
      description:
        "Bo mạch chủ dòng TUF với VRM 8+1, hỗ trợ DDR5 và WiFi 6 sẵn sàng cho CPU Intel Gen 14.",
      highlights: ["WiFi 6", "PCIe 4.0", "DDR5 7200MHz"],
    },
    {
      id: "mb-msi-b550-gaming-edge",
      variantId: 9992,
      sku: "msi-b550-gaming-edge",
      name: "Mainboard MSI MPG B550 Gaming Edge WiFi",
      brand: "MSI",
      socket: "AM4",
      chipset: "AMD B550",
      form: "ATX",
      price: 4499000,
      stock: 14,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/80?text=MB",
      description:
        "Mainboard phổ thông hỗ trợ Ryzen 5000 cùng trang bị tản nhiệt VRM lớn.",
      highlights: ["WiFi 6", "M.2 Shield Frozr", "12+2 Duet Rail Power"],
    },
  ],
  ram: [
    {
      id: "ram-gskill-trident-z-32gb",
      variantId: 347,
      sku: "gskill-trident-z-default",
      name: "RAM G.Skill Trident Z RGB 32GB (2x16GB) DDR4 3600MHz",
      brand: "G.Skill",
      type: "DDR4",
      capacity: "32GB",
      speed: "3600MHz",
      price: 3290000,
      stock: 20,
      warranty: "60 tháng",
      image: "https://via.placeholder.com/80?text=RAM",
      description: "Bộ nhớ có XMP 2.0, tản nhiệt nhôm và dải RGB đồng bộ.",
      highlights: ["CL16", "RGB Sync", "XMP 2.0"],
    },
    {
      id: "ram-corsair-vengeance-32",
      variantId: 9993,
      sku: "corsair-vengeance-rgb-32",
      name: "RAM Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4 3200MHz",
      brand: "Corsair",
      type: "DDR4",
      capacity: "32GB",
      speed: "3200MHz",
      price: 3090000,
      stock: 35,
      warranty: "60 tháng",
      image: "https://via.placeholder.com/80?text=RAM",
      description: "Lựa chọn phổ biến cho cấu hình gaming RGB với khả năng OC ổn định.",
      highlights: ["CL16", "iCUE Sync", "Tản nhiệt nhôm"],
    },
  ],
  vga: [
    {
      id: "gpu-asus-rtx-5060ti",
      variantId: 337,
      sku: "asus-rtx-5060ti-default",
      name: "VGA ASUS Dual RTX 5060 Ti 8GB",
      brand: "ASUS",
      chipset: "NVIDIA RTX 5060 Ti",
      memory: "8GB GDDR6",
      price: 8000000,
      stock: 596,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/80?text=GPU",
      description: "Tản nhiệt 2 fan Axial-tech, hỗ trợ DLSS 3 cho trải nghiệm gaming mượt.",
      highlights: ["DLSS 3", "8GB GDDR6", "Axial-tech"],
    },
    {
      id: "gpu-asus-rtx-5070",
      variantId: 349,
      sku: "asus-rtx-5070-default",
      name: "VGA ASUS Dual RTX 5070 12GB",
      brand: "ASUS",
      chipset: "NVIDIA RTX 5070",
      memory: "12GB GDDR6",
      price: 12000000,
      stock: 5,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/80?text=GPU",
      description: "Chuẩn bị cho 2K 165Hz với hiệu năng vượt trội và thiết kế 2.5 slot.",
      highlights: ["12GB VRAM", "Ada Lovelace", "HDMI 2.1"],
    },
  ],
  ssd: [
    {
      id: "ssd-samsung-980pro-1tb",
      variantId: 6001,
      sku: "ssd-samsung-980pro-1tb",
      name: "SSD Samsung 980 PRO 1TB NVMe PCIe 4.0",
      brand: "Samsung",
      type: "NVMe M.2",
      capacity: "1TB",
      price: 2990000,
      stock: 80,
      warranty: "60 tháng",
      image: "https://via.placeholder.com/80?text=SSD",
      description: "Tốc độ đọc lên tới 7000 MB/s, tối ưu cho gaming và dựng video.",
      highlights: ["PCIe 4.0", "7000 MB/s", "Dynamic Thermal Guard"],
    },
    {
      id: "ssd-kingston-nv2-512",
      variantId: 6002,
      sku: "ssd-kingston-nv2-512",
      name: "SSD Kingston NV2 512GB NVMe PCIe 4.0",
      brand: "Kingston",
      type: "NVMe M.2",
      capacity: "512GB",
      price: 1190000,
      stock: 120,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/80?text=SSD",
      description: "Giải pháp lưu trữ giá tốt, phù hợp cấu hình phổ thông.",
      highlights: ["PCIe 4.0 x4", "Tốc độ 3500 MB/s", "Bảo hành 36 tháng"],
    },
  ],
  hdd: [
    {
      id: "hdd-seagate-barracuda-2tb",
      variantId: 355,
      sku: "Seagate-1TB-5400RPM",
      name: "HDD Seagate Barracuda 2TB 5400RPM",
      brand: "Seagate",
      type: "3.5 inch",
      capacity: "2TB",
      price: 1690000,
      stock: 42,
      warranty: "24 tháng",
      image: "https://via.placeholder.com/80?text=HDD",
      description: "Ổ cứng lưu trữ dung lượng lớn, độ bền cao.",
      highlights: ["Cache 256MB", "Multi-Tier Caching", "Bảo hành 24 tháng"],
    },
  ],
  psu: [
    {
      id: "psu-corsair-rm750e",
      variantId: 7001,
      sku: "corsair-rm750e-80plus-gold",
      name: "PSU Corsair RM750e 750W 80 Plus Gold (ATX 3.0)",
      brand: "Corsair",
      wattage: "750W",
      certification: "80 Plus Gold",
      price: 3290000,
      stock: 60,
      warranty: "84 tháng",
      image: "https://via.placeholder.com/80?text=PSU",
      description: "Nguồn đạt chuẩn ATX 3.0 kèm cáp 12VHPWR, phù hợp RTX 40 series.",
      highlights: ["ATX 3.0", "Full Modular", "80 Plus Gold"],
    },
    {
      id: "psu-cooler-master-gx650",
      variantId: 7002,
      sku: "cooler-master-gx650",
      name: "PSU Cooler Master GX II Gold 650W",
      brand: "Cooler Master",
      wattage: "650W",
      certification: "80 Plus Gold",
      price: 2390000,
      stock: 75,
      warranty: "60 tháng",
      image: "https://via.placeholder.com/80?text=PSU",
      description: "Nguồn Gold giá tốt, dây bán modular dễ đi dây.",
      highlights: ["80 Plus Gold", "DC-to-DC", "Fan 120mm FDB"],
    },
  ],
  case: [
    {
      id: "case-nzxt-h7-flow",
      variantId: 8001,
      sku: "nzxt-h7-flow",
      name: "Vỏ Case NZXT H7 Flow",
      brand: "NZXT",
      form: "ATX Mid Tower",
      price: 2890000,
      stock: 25,
      warranty: "24 tháng",
      image: "https://via.placeholder.com/80?text=CASE",
      description: "Thiết kế Airflow tối ưu với mặt trước dạng mesh.",
      highlights: ["Airflow tốt", "Hỗ trợ 360mm", "Kính cường lực"],
    },
    {
      id: "case-cooler-master-td500",
      variantId: 8002,
      sku: "cooler-master-td500",
      name: "Vỏ Case Cooler Master TD500 Mesh V2",
      brand: "Cooler Master",
      form: "ATX Mid Tower",
      price: 2490000,
      stock: 30,
      warranty: "24 tháng",
      image: "https://via.placeholder.com/80?text=CASE",
      description: "Mặt trước 3D độc đáo kèm 3 quạt ARGB sẵn.",
      highlights: ["ARGB Sync", "Hỗ trợ 360mm", "USB-C front panel"],
    },
  ],
  cooling: [
    {
      id: "cooling-lianli-galahad-240",
      variantId: 9001,
      sku: "lianli-galahad-240-argb",
      name: "Tản nhiệt nước AIO Lian Li Galahad 240 ARGB",
      brand: "Lian Li",
      type: "AIO",
      size: "240mm",
      price: 2990000,
      stock: 40,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/80?text=AIO",
      description: "Block nhôm phay xước kèm vòng ARGB sang trọng.",
      highlights: ["Ống bọc lưới", "ARGB Sync", "Pump Asetek Gen7"],
    },
    {
      id: "cooling-deepcool-ak620",
      variantId: 9002,
      sku: "deepcool-ak620",
      name: "Tản nhiệt khí Deepcool AK620 Digital",
      brand: "Deepcool",
      type: "Air",
      size: "Dual tower",
      price: 2690000,
      stock: 50,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/80?text=AIR",
      description: "Tháp đôi đi kèm màn hình LED hiển thị nhiệt độ CPU.",
      highlights: ["Dual Tower", "Màn LED", "Fan FDB 1850RPM"],
    },
  ],
  monitor: [
    {
      id: "monitor-lg-27gn800",
      variantId: 9501,
      sku: "lg-27gn800-b",
      name: "Màn hình LG UltraGear 27GN800-B 27\" QHD 144Hz",
      brand: "LG",
      size: '27"',
      panel: "IPS",
      refresh: "144Hz",
      price: 8490000,
      stock: 25,
      warranty: "24 tháng",
      image: "https://via.placeholder.com/120?text=Monitor",
      description: "Tốc độ làm tươi 144Hz, G-Sync Compatible dành cho game thủ.",
      highlights: ["QHD 144Hz", "sRGB 99%", "1ms GtG"],
    },
    {
      id: "monitor-dell-s3220dgf",
      variantId: 9502,
      sku: "dell-s3220dgf",
      name: "Màn hình Dell S3220DGF 32\" QHD 165Hz VA",
      brand: "Dell",
      size: '32"',
      panel: "VA",
      refresh: "165Hz",
      price: 9990000,
      stock: 18,
      warranty: "24 tháng",
      image: "https://via.placeholder.com/120?text=Monitor",
      description: "Màn hình gaming 32 inch với độ sáng cao, tốc độ làm tươi 165Hz.",
      highlights: ["QHD 165Hz", "VA Panel", "HDR"],
    },
  ],
  keyboard: [
    {
      id: "keyboard-ikbc-c87",
      variantId: 9601,
      sku: "ikbc-c87",
      name: "Bàn phím cơ iKBC CD87 Cherry MX Red",
      brand: "iKBC",
      price: 1890000,
      stock: 40,
      warranty: "12 tháng",
      image: "https://via.placeholder.com/120?text=Keyboard",
      description: "Layout TKL nhỏ gọn, switch Cherry MX, keycap PBT dye-sub.",
      highlights: ["Cherry MX Red", "Keycap PBT", "N-key rollover"],
    },
    {
      id: "keyboard-corsair-k95",
      variantId: 9602,
      sku: "corsair-k95-platinum",
      name: "Bàn phím Corsair K95 Platinum XT Mechanical",
      brand: "Corsair",
      price: 3890000,
      stock: 25,
      warranty: "12 tháng",
      image: "https://via.placeholder.com/120?text=Keyboard",
      description: "Bàn phím full-size gaming cao cấp với Cherry MX Speed, RGB per-key.",
      highlights: ["Cherry MX Speed", "RGB", "Aluminum Frame"],
    },
  ],
  mouse: [
    {
      id: "mouse-logi-g304",
      variantId: 9701,
      sku: "logitech-g304",
      name: "Chuột Logitech G304 Lightspeed Wireless",
      brand: "Logitech",
      price: 990000,
      stock: 60,
      warranty: "24 tháng",
      image: "https://via.placeholder.com/120?text=Mouse",
      description: "Chuột không dây LIGHTSPEED với cảm biến HERO 12K.",
      highlights: ["Wireless", "HERO 12K", "6 nút lập trình"],
    },
    {
      id: "mouse-razer-viper-ultimate",
      variantId: 9702,
      sku: "razer-viper-ultimate",
      name: "Chuột Razer Viper Ultimate Wireless",
      brand: "Razer",
      price: 2990000,
      stock: 30,
      warranty: "24 tháng",
      image: "https://via.placeholder.com/120?text=Mouse",
      description: "Chuột gaming nhẹ nhất, Focus Pro 30K sensor, tốc độ reaction tức thì.",
      highlights: ["Wireless", "30K DPI", "70g"],
    },
  ],
  headphone: [
    {
      id: "headphone-hyperx-cloud",
      variantId: 9801,
      sku: "hyperx-cloud-2",
      name: "Tai nghe HyperX Cloud II Gaming",
      brand: "HyperX",
      price: 2390000,
      stock: 35,
      warranty: "24 tháng",
      image: "https://via.placeholder.com/120?text=Headphone",
      description: "Âm thanh 7.1 giả lập, micro chống ồn, đệm tai êm ái.",
      highlights: ["7.1 Surround", "Micro tháo rời", "Khung nhôm"],
    },
    {
      id: "headphone-sennheiser-gsx1000",
      variantId: 9802,
      sku: "sennheiser-gsx1000",
      name: "Tai nghe Sennheiser GSX 1200 Pro Gaming",
      brand: "Sennheiser",
      price: 5290000,
      stock: 20,
      warranty: "24 tháng",
      image: "https://via.placeholder.com/120?text=Headphone",
      description: "Tai nghe gaming chuyên nghiệp với âm thanh đỏ tuyệt vời và siêu thoải mái.",
      highlights: ["7.1 Surround", "Pro Grade", "Siêu thoải mái"],
    },
  ],
  speaker: [
    {
      id: "speaker-logi-z906",
      variantId: 9901,
      sku: "logitech-z906",
      name: "Loa Logitech Z906 5.1",
      brand: "Logitech",
      price: 6590000,
      stock: 15,
      warranty: "24 tháng",
      image: "https://via.placeholder.com/120?text=Speaker",
      description: "Hệ thống loa 5.1 chuẩn THX, công suất 500W.",
      highlights: ["5.1 THX", "500W RMS", "Nhiều ngõ vào"],
    },
    {
      id: "speaker-jbl-lsr305",
      variantId: 9902,
      sku: "jbl-lsr305-studio",
      name: "Loa JBL LSR305 Studio Monitor",
      brand: "JBL",
      price: 4990000,
      stock: 22,
      warranty: "24 tháng",
      image: "https://via.placeholder.com/120?text=Speaker",
      description: "Loa studio chuyên nghiệp với âm thanh chuẩn, phù hợp gaming và sản xuất.",
      highlights: ["Studio Grade", "Flat Response", "120W"],
    },
  ],
  gamingChair: [
    {
      id: "chair-secretlab-titan",
      variantId: 9951,
      sku: "secretlab-titan-evo",
      name: "Ghế Secretlab TITAN Evo 2022",
      brand: "Secretlab",
      price: 13490000,
      stock: 10,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/120?text=Chair",
      description: "Ghế gaming cao cấp với đệm lạnh, hỗ trợ lưng công thái học.",
      highlights: ["Magnetic Head Pillow", "4D Armrest", "SeatBase đúc"],
    },
    {
      id: "chair-herman-miller-embody",
      variantId: 9952,
      sku: "herman-miller-embody-gaming",
      name: "Ghế Herman Miller Embody Gaming Edition",
      brand: "Herman Miller",
      price: 18990000,
      stock: 8,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/120?text=Chair",
      description: "Ghế gaming hạng sang với công thái học tối ưu, hỗ trợ ngồi 8+ giờ.",
      highlights: ["PostureFit", "12D Adjustable", "Logitech Integration"],
    },
  ],
  caseFan: [
    {
      id: "fan-lianli-uni-120",
      variantId: 9961,
      sku: "lianli-uni-fan-sl120",
      name: "Bộ 3 quạt Lian Li UNI FAN SL120 V2",
      brand: "Lian Li",
      price: 2290000,
      stock: 40,
      warranty: "12 tháng",
      image: "https://via.placeholder.com/120?text=Fan",
      description: "Quạt modular kết nối nhanh, LED ARGB đồng bộ.",
      highlights: ["ARGB", "Modular", "2500RPM"],
    },
    {
      id: "fan-corsair-sp120-elite",
      variantId: 9962,
      sku: "corsair-sp120-elite",
      name: "Bộ 3 quạt Corsair SP120 Elite RGB",
      brand: "Corsair",
      price: 1690000,
      stock: 50,
      warranty: "12 tháng",
      image: "https://via.placeholder.com/120?text=Fan",
      description: "Quạt case với RGB tích hợp, airflow tốt, tĩnh lặng.",
      highlights: ["RGB", "PWM", "2400RPM"],
    },
  ],
  airCooler: [
    {
      id: "aircooler-bequiet-darkrock",
      variantId: 9971,
      sku: "bequiet-dark-rock4",
      name: "Tản nhiệt khí be quiet! Dark Rock 4",
      brand: "be quiet!",
      price: 2390000,
      stock: 18,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/120?text=Air+Cooler",
      description: "Tản khí cao cấp, hoạt động êm, TDP 200W.",
      highlights: ["Silent Wings 135mm", "6 heatpipe", "TDP 200W"],
    },
    {
      id: "aircooler-noctua-nh-d15",
      variantId: 9972,
      sku: "noctua-nh-d15",
      name: "Tản nhiệt khí Noctua NH-D15 Chromax Black",
      brand: "Noctua",
      price: 3490000,
      stock: 15,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/120?text=Air+Cooler",
      description: "Tản nhiệt khí dual tower tốt nhất, tĩnh lặng, TDP 250W.",
      highlights: ["Dual Tower", "6 heatpipe", "TDP 250W"],
    },
  ],
  aioCooler: [
    {
      id: "aio-nzxt-kraken-360",
      variantId: 9981,
      sku: "nzxt-kraken-360",
      name: "Tản nước AIO NZXT Kraken 360 RGB",
      brand: "NZXT",
      price: 5490000,
      stock: 22,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/120?text=AIO",
      description: "Mặt gương vô cực, màn LCD, hiệu năng cao.",
      highlights: ["LCD Display", "Radiator 360mm", "ARGB Fan"],
    },
    {
      id: "aio-corsair-h150i-elite",
      variantId: 9982,
      sku: "corsair-h150i-elite",
      name: "Tản nước AIO Corsair H150i Elite Capellix XT",
      brand: "Corsair",
      price: 4890000,
      stock: 28,
      warranty: "36 tháng",
      image: "https://via.placeholder.com/120?text=AIO",
      description: "Tản nước AIO 360mm với pump hiệu năng cao, RGB đầy đủ.",
      highlights: ["Radiator 360mm", "RGB", "iCUE Compatible"],
    },
  ],
  customWater: [
    {
      id: "custom-ek-kit",
      variantId: 9991,
      sku: "ek-quantum-custom",
      name: "Bộ kit tản nhiệt nước Custom EK-Quantum",
      brand: "EKWB",
      price: 11990000,
      stock: 5,
      warranty: "12 tháng",
      image: "https://via.placeholder.com/120?text=Custom+Loop",
      description: "Full kit custom loop với block CPU, pump/res, radiator 360mm.",
      highlights: ["Block Nickel", "Pump D5", "Ống cứng PMMA"],
    },
    {
      id: "custom-alphacool-eiswolf",
      variantId: 9992,
      sku: "alphacool-eiswolf-pro",
      name: "Bộ kit tản nước Custom Alphacool Eiswolf Pro",
      brand: "Alphacool",
      price: 9990000,
      stock: 8,
      warranty: "12 tháng",
      image: "https://via.placeholder.com/120?text=Custom+Loop",
      description: "Kit custom loop chất lượng với block CPU+VGA, bơm DDC, radiator 360mm.",
      highlights: ["CPU+GPU Block", "Pump DDC", "Radiator 360mm"],
    },
  ],
};

const componentTypes = [
  { id: "cpu", name: "Bộ vi xử lý", description: "Trái tim của hệ thống.", required: true },
  { id: "mainboard", name: "Bo mạch chủ", description: "Nền tảng kết nối linh kiện.", required: true },
  { id: "ram", name: "RAM", description: "Đa nhiệm và tốc độ phản hồi.", required: true },
  { id: "hdd", name: "HDD", description: "Lưu trữ dung lượng lớn.", required: false },
  { id: "ssd", name: "SSD", description: "Tăng tốc hệ điều hành và ứng dụng.", required: true },
  { id: "vga", name: "VGA", description: "Hiển thị đồ họa, gaming, sáng tạo.", required: false },
  { id: "psu", name: "Nguồn", description: "Cấp năng lượng ổn định.", required: true },
  { id: "case", name: "Vỏ Case", description: "Thiết kế, airflow và mở rộng.", required: true },
  { id: "monitor", name: "Màn hình", description: "Trải nghiệm hình ảnh, màu sắc.", required: false },
  { id: "keyboard", name: "Bàn phím", description: "Gõ phím, nhập liệu, gaming.", required: false },
  { id: "mouse", name: "Chuột", description: "Điều khiển nhanh chóng, chính xác.", required: false },
  { id: "headphone", name: "Tai nghe", description: "Âm thanh tập trung, giao tiếp.", required: false },
  { id: "speaker", name: "Loa", description: "Giải trí, nghe nhạc, xem phim.", required: false },
  { id: "gamingChair", name: "Ghế Gaming", description: "Tư thế ngồi thoải mái, hỗ trợ lâu dài.", required: false },
  { id: "caseFan", name: "Quạt Làm Mát", description: "Cải thiện airflow, hạ nhiệt độ.", required: false },
  { id: "airCooler", name: "Tản nhiệt khí", description: "Giải pháp làm mát CPU phổ biến.", required: false },
  { id: "aioCooler", name: "Tản nhiệt nước All in One", description: "Hiệu quả làm mát cao, gọn gàng.", required: false },
  { id: "customWater", name: "Tản nhiệt nước Custom", description: "Làm mát cao cấp, tùy biến theo ý muốn.", required: false },
];


const defaultPickerState = {
  open: false,
  type: null,
  search: "",
  brand: "all",
  price: "all",
  sort: "default",
};

const BuildPC = () => {
  const [selectedComponents, setSelectedComponents] = useState({});
  const [pickerState, setPickerState] = useState(defaultPickerState);
  const [quantities, setQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [seriesFilters, setSeriesFilters] = useState([]);
  const pageSize = 6;
  const sortTabs = [
    { value: "default", label: "Khuyến mãi tốt nhất" },
    { value: "desc", label: "Giá giảm dần" },
    { value: "asc", label: "Giá tăng dần" },
  ];

  const initializeFilterState = useCallback(
    (typeId) => {
      const items = mockCatalog[typeId] || [];
      if (!items.length) {
        setPriceRange([0, 0]);
        setBrandFilters([]);
        setSeriesFilters([]);
        return;
      }
      const prices = items.map((item) => item.price || 0);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange([min, max]);
      setBrandFilters([]);
      setSeriesFilters([]);
    },
    []
  );

  const handleBrandToggle = (brand) => {
    setBrandFilters((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleSeriesToggle = (value) => {
    setSeriesFilters((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleResetFilters = () => {
    if (pickerState.type) {
      initializeFilterState(pickerState.type);
    } else {
      setPriceRange([0, 0]);
      setBrandFilters([]);
      setSeriesFilters([]);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const calculateTotal = useMemo(
    () =>
      Object.entries(selectedComponents).reduce(
        (sum, [type, component]) =>
          sum + (component?.price || 0) * (quantities[type] || 1),
        0
      ),
    [selectedComponents, quantities]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [pickerState.search, pickerState.brand, pickerState.price, pickerState.sort, pickerState.type]);

  const openPicker = (type) => {
    initializeFilterState(type);
    setPickerState({
      ...defaultPickerState,
      open: true,
      type,
    });
    setCurrentPage(1);
  };

  const closePicker = () => {
    setPickerState(defaultPickerState);
    setCurrentPage(1);
    setPriceRange([0, 0]);
    setBrandFilters([]);
    setSeriesFilters([]);
  };

  useEffect(() => {
    if (pickerState.open && pickerState.type) {
      initializeFilterState(pickerState.type);
    }
  }, [pickerState.open, pickerState.type, initializeFilterState]);

  const handleAddComponent = (component) => {
    if (!pickerState.type) return;
    setSelectedComponents((prev) => ({
      ...prev,
      [pickerState.type]: component,
    }));
    setQuantities((prev) => ({
      ...prev,
      [pickerState.type]: prev[pickerState.type] || 1,
    }));
    closePicker();
  };

  const handleQuantityAdjust = (type, delta) => {
    setQuantities((prev) => {
      const current = prev[type] || 1;
      const nextValue = Math.max(1, current + delta);
      return {
        ...prev,
        [type]: nextValue,
      };
    });
  };

  const handleQuantityInput = (type, value) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: Math.max(1, Number(value) || 1),
    }));
  };

  const handleRemoveComponent = (type) => {
    setSelectedComponents((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  };

  const catalogItems = useMemo(
    () => (pickerState.type ? mockCatalog[pickerState.type] || [] : []),
    [pickerState.type]
  );

  const priceBounds = useMemo(() => {
    if (!catalogItems.length) {
      return { min: 0, max: 0 };
    }
    const prices = catalogItems.map((item) => item.price || 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [catalogItems]);

  const filteredComponents = useMemo(() => {
    if (!pickerState.type) return [];
    let items = [...catalogItems];

    if (pickerState.search) {
      const query = pickerState.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query)
      );
    }

    const [minPrice, maxPrice] = priceRange;
    if (maxPrice > 0) {
      items = items.filter(
        (item) => item.price >= minPrice && item.price <= maxPrice
      );
    }

    if (brandFilters.length) {
      items = items.filter((item) => brandFilters.includes(item.brand));
    }

    if (seriesFilters.length) {
      items = items.filter((item) => {
        const descriptors = [item.chipset, item.type, item.generation].filter(Boolean);
        return seriesFilters.some((value) => descriptors.includes(value));
      });
    }

    if (pickerState.sort === "asc") {
      items.sort((a, b) => a.price - b.price);
    }

    if (pickerState.sort === "desc") {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }, [catalogItems, pickerState.search, pickerState.sort, priceRange, brandFilters, seriesFilters]);

  const brandOptions = useMemo(() => {
    if (!pickerState.type) return [];
    const set = new Set(catalogItems.map((item) => item.brand));
    return Array.from(set);
  }, [catalogItems, pickerState.type]);

  const seriesOptions = useMemo(() => {
    const set = new Set();
    catalogItems.forEach((item) => {
      if (item.chipset) set.add(item.chipset);
      if (item.type && item.type.length <= 15) set.add(item.type);
    });
    return Array.from(set);
  }, [catalogItems]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredComponents.length / pageSize)
  );

  const paginatedComponents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredComponents.slice(start, start + pageSize);
  }, [filteredComponents, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageNumbers = useMemo(() => {
    const buttons = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i += 1) {
      buttons.push(i);
    }
    return buttons;
  }, [currentPage, totalPages]);


  return (
    <div className="py-8 space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600">
          <Cpu className="h-4 w-4" />
          Công cụ Build PC
        </div>
        <h1 className="text-3xl font-bold">Xây dựng cấu hình PC toàn màn hình</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Quản lý toàn bộ danh sách linh kiện trên một trang, dễ dàng chọn, lọc và sắp xếp sản phẩm dựa trên kho dữ liệu B.A Tech Zone.
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* Main table of component slots */}
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-1">
            <CardTitle>Danh sách linh kiện</CardTitle>
            <CardDescription>Chọn từng hạng mục để hoàn thiện cấu hình của bạn.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Thông tin linh kiện</TableHead>
                    <TableHead className="text-center whitespace-nowrap">Số lượng</TableHead>
                    <TableHead className="text-right">Giá</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {componentTypes.map((type, idx) => (
                    <TableRow key={type.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <div className="font-semibold flex items-center gap-1">
                          {type.name}
                          {type.required && (
                            <span className="text-xs text-red-500 font-normal">(bắt buộc)</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </TableCell>
                      <TableCell>
                        {selectedComponents[type.id] ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={selectedComponents[type.id].image}
                              alt={selectedComponents[type.id].name}
                              className="h-12 w-12 rounded-md border object-cover"
                            />
                            <div>
                              <p className="font-medium">{selectedComponents[type.id].name}</p>
                              <p className="text-xs text-muted-foreground">
                                {selectedComponents[type.id].brand} • {selectedComponents[type.id].sku}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Chưa chọn</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {selectedComponents[type.id] ? (
                          <div className="inline-flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleQuantityAdjust(type.id, -1)}>-</Button>
                            <Input
                              type="number"
                              min={1}
                              value={quantities[type.id] || 1}
                              onChange={(e) => handleQuantityInput(type.id, e.target.value)}
                              className="w-16 text-center"
                            />
                            <Button variant="outline" size="icon" onClick={() => handleQuantityAdjust(type.id, 1)}>+</Button>
                          </div>
                        ) : (
                          "--"
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {selectedComponents[type.id]
                          ? formatPrice((selectedComponents[type.id].price || 0) * (quantities[type.id] || 1))
                          : "--"}
                      </TableCell>
                      <TableCell className="text-right">
                        {selectedComponents[type.id] && (
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveComponent(type.id)}>
                            <X className="h-4 w-4" />Bỏ
                          </Button>
                        )}
                        <Button size="sm" onClick={() => openPicker(type.id)} variant="outline">
                          <PlusCircle className="h-4 w-4 mr-2" />Thêm linh kiện
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t p-6">
            <div>
              <p className="text-sm text-muted-foreground">Tổng giá trị tạm tính</p>
              <p className="text-2xl font-bold text-red-600">{formatPrice(calculateTotal)}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedComponents({});
                  setQuantities({});
                }}
              >
                Xóa tất cả
              </Button>
              <Button disabled={calculateTotal === 0}>Thêm vào giỏ hàng</Button>
            </div>
          </div>
        </Card>

        {/* Summary card - below table on mobile, sticky on right on large screens */}
        <Card className="w-full lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle>Cấu hình đã chọn</CardTitle>
            <CardDescription>Tóm tắt nhanh các linh kiện đang có trong build của bạn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[60vh] overflow-auto">
            {Object.keys(selectedComponents).length === 0 ? (
              <div className="text-sm text-muted-foreground">Chưa có linh kiện nào được chọn.</div>
            ) : (
              Object.entries(selectedComponents).map(([type, component]) => (
                <div key={type} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium">{componentTypes.find((t) => t.id === type)?.name}</p>
                    <p className="text-sm text-muted-foreground">{component.name}</p>
                    <p className="text-xs text-muted-foreground">Số lượng: {quantities[type] || 1}</p>
                  </div>
                  <span className="font-semibold text-red-500">{formatPrice(component.price * (quantities[type] || 1))}</span>
                </div>
              ))
            )}

            <div className="flex flex-col gap-1 border-t pt-2">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Tổng cộng</span>
                <span className="text-red-600">{formatPrice(calculateTotal)}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => { setSelectedComponents({}); setQuantities({}); }}>
                  Xóa cấu hình
                </Button>
                <Button size="sm" className="flex-1 h-8 text-xs" disabled={calculateTotal === 0}>
                  Thêm vào giỏ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={pickerState.open} onOpenChange={(open) => !open && closePicker()}>
        <DialogContent className="!fixed !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[90vw] !h-[90vh] !max-w-none !p-0 !gap-0 !border-0 !rounded-lg !overflow-hidden !grid !grid-cols-1">
          <DialogHeader className="sr-only">
            <DialogTitle>Chọn linh kiện cho cấu hình</DialogTitle>
            <DialogDescription>
              Tìm kiếm, lọc và thêm linh kiện phù hợp vào cấu hình Build PC.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] w-full h-full gap-0 bg-white overflow-hidden flex-1">
            {/* Left: Filters */}
            <div className="border-r bg-white overflow-hidden flex flex-col min-w-0 h-full">
              <div className="bg-blue-700 px-3 py-2 text-white font-semibold flex-shrink-0 text-sm">
                Bộ lọc
              </div>
              <ScrollArea className="flex-1 px-3 py-3">
                <div className="space-y-4 pr-2 w-full">
                  <section className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Khoảng giá</span>
                      <span>
                        {formatPrice(priceRange[0] || priceBounds.min)} -{" "}
                        {formatPrice(priceRange[1] || priceBounds.max)}
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      min={priceBounds.min}
                      max={Math.max(priceBounds.max, priceBounds.min + 1)}
                      step={50000}
                      onValueChange={(value) => setPriceRange(value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatPrice(priceBounds.min)}</span>
                      <span>{formatPrice(priceBounds.max)}</span>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <p className="text-sm font-semibold">Thương hiệu</p>
                    <div className="space-y-2">
                      {brandOptions.length === 0 && (
                        <p className="text-xs text-muted-foreground">Không có dữ liệu</p>
                      )}
                      {brandOptions.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"
                        >
                          <Checkbox
                            checked={brandFilters.includes(brand)}
                            onCheckedChange={() => handleBrandToggle(brand)}
                          />
                          {brand}
                        </label>
                      ))}
                    </div>
                  </section>

                  {seriesOptions.length > 0 && (
                    <section className="space-y-3">
                      <p className="text-sm font-semibold">
                        {pickerState.type === "cpu" ? "Dòng CPU" : "Thuộc tính nổi bật"}
                      </p>
                      <div className="space-y-2">
                        {seriesOptions.map((value) => (
                          <label
                            key={value}
                            className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"
                          >
                            <Checkbox
                              checked={seriesFilters.includes(value)}
                              onCheckedChange={() => handleSeriesToggle(value)}
                            />
                            {value}
                          </label>
                        ))}
                      </div>
                    </section>
                  )}

                  <Button variant="outline" size="sm" onClick={handleResetFilters} className="w-full">
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </ScrollArea>
            </div>

            {/* Right: Products */}
            <div className="flex flex-col overflow-hidden min-w-0 h-full bg-white">
              <div className="flex-shrink-0 border-b bg-white p-3 space-y-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-9 h-9 text-sm"
                    value={pickerState.search}
                    onChange={(e) =>
                      setPickerState((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {sortTabs.map((tab) => (
                    <Button
                      key={tab.value}
                      variant={pickerState.sort === tab.value ? "default" : "outline"}
                      size="sm"
                      className="rounded-full text-xs h-8 px-3"
                      onClick={() =>
                        setPickerState((prev) => ({
                          ...prev,
                          sort: tab.value,
                        }))
                      }
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Tìm thấy {filteredComponents.length} sản phẩm
                </div>
              </div>

              <ScrollArea className="flex-1 min-h-0">
                <div className="p-3 space-y-2">
                  {paginatedComponents.length === 0 ? (
                    <Card>
                      <CardContent className="py-6 text-center text-xs text-muted-foreground">
                        Không có sản phẩm phù hợp.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {paginatedComponents.map((item) => (
                        <Card key={item.id} className="border shadow-sm">
                          <CardContent className="flex flex-col gap-2 p-3 sm:flex-row sm:items-start">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-24 w-24 rounded-lg border object-contain flex-shrink-0"
                            />
                            <div className="flex-1 space-y-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                                <div className="min-w-0">
                                  <p className="text-xs uppercase text-muted-foreground">
                                    {item.brand}
                                  </p>
                                  <p className="font-semibold leading-tight text-sm">
                                    {item.name}
                                  </p>
                                </div>
                                <span className="text-sm font-bold text-red-600 flex-shrink-0">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                              <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                                {(item.highlights || []).slice(0, 2).map((highlight) => (
                                  <span
                                    key={highlight}
                                    className="rounded-full bg-muted px-2 py-0.5"
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-600">
                                <span>{item.stock > 0 ? "Còn" : "Liên hệ"}</span>
                                {item.warranty && <span>BH: {item.warranty}</span>}
                              </div>
                            </div>
                            <Button
                              className="w-full rounded-full sm:w-auto sm:flex-shrink-0 h-9 px-3 text-xs"
                              onClick={() => handleAddComponent(item)}
                            >
                              <PlusCircle className="mr-1 h-3 w-3" />
                              Thêm
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {totalPages > 1 && (
                <div className="flex-shrink-0 border-t bg-white p-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground">
                    Trang {currentPage}/{totalPages}
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    >
                      Trước
                    </Button>
                    <div className="flex items-center gap-0.5">
                      {pageNumbers.map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0 text-xs"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuildPC;
