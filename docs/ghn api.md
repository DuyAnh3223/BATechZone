Calculate the expected delivery time
API Calculate the expected delivery time
 
Accurate time will be delivered to guests

Caution : The API Order Info need to infusion Token and ShopId in header

post/get
Production
https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime
Test
https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime
Curl
curl --location --request POST 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime' \
--header 'Content-Type: application/json' \
--header 'ShopId: 916' \
--header 'Token: e835a5a1-b111-11ea-aea1-7aad6bea2429' \
--data-raw '{
    "from_district_id": 1750,
    "from_ward_code": "1A0706",
    "to_district_id": 1750,
    "to_ward_code": "511110",
    "service_id": 53320
}'

Parameter
Field	Type	Description
token	String	
Must be sent with all client requests. This Token helps server to validate request source. Provided by GHN.

ShopID	Int	
Manage information for shop/seller

from_district_id	Int	
District ID pick up parcels.Use API Get District

to_district_id	Int	
District ID drop off parcels.Use API Get District

to_ward_code	String	
Ward Code pick up parcels.Use API Get Ward

service_id	Int	
Choose which Sevice ID suitable with your shipping plan (Express, Standard or Saving). Each Service ID has different fee and leadtime.

Use API Get service (if not input service_type_id)

Success 200
{
    "code": 200,
    "message": "Success",
    "data":{
    "leadtime":1593187200
    "order_date":1592981718
    }
}
Structure Response
Field	Description
leadtime	
Expected delivery time

order_date	
Order creation date

Error-Response
{
    "code": 400,
    "message": "code=400, message=Syntax error: offset=30, error=invalid character '}' after array element, internal=invalid character '}' after array element",
    "data": null
    "code_message": "USER_ERR_COMMON"
}


Calculate Fee
API Calculate Fee
 
This API can help Shop/Merchant get the shipping fee and provide to buyer before create shipping order by

input some information such as Weight,Height,length,width ,to_district_ID, to_ward_code, Service_ID.

Caution : The API Order Info need to infusion token in ShopId header

post/get
Production
https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee
Test
https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee
Curl
curl --location --request POST 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee' \
            --header 'Content-Type: application/json' \
            --header 'Token: 637170d5-942b-11ea-9821-0281a26fb5d4' \
            --header 'ShopId: 885' \
            --header 'Content-Type: text/plain' \
            --data-raw '{
            "from_district_id":1454,
            "from_ward_code":"21211",
            "service_id":53320,
            "service_type_id":null,
            "to_district_id":1452,
            "to_ward_code":"21012",
            "height":50,
            "length":20,
            "weight":200,
            "width":20,
            "insurance_value":10000,
            "cod_failed_amount":2000,
            "coupon": null
            "items": [
                {
                  "name": "TEST1",
                  "quantity": 1,
                  "height": 200,
                  "weight": 1000,
                  "length": 200,
                  "width": 200
                }
              ]
            }'
 
Parameter
Field	Require	Type	Description
token	X	String	
Must be sent with all client requests. This Token helps server to validate request source. Provided by GHN.

shop_id	X	Int	
Manage information for shop/seller

service_id	 	Int	
Call API SERVICE to show service.
If not input service_type_id

service_type_id	 	Int	
Call API SERVICE to show service.

Default value:  2:E-Commerce Delivery

If not input service_id.

insurance_value	 	Int	
Use to declare parcel value. GHN will base on this value for compensation if any unexpected things happen (lost, broken...).

Maximum 5.000.000

Default value: 0

coupon	 	String	
Coupon Code for discount.

cod_failed_amount	 	Int	
Value of collect money when delivery fail

from_district_id	 	Int	
District ID pick up parcels.Use API Get District

If you not input , will get information from shopid

from_ward_code	 	String	
Ward code pick up parcels.Use API Get Ward

If you not input , will get information from shopid

to_ward_code	X	String	
Ward Code pick up parcels.Use API Get Ward

to_district_id	X	Int	
District ID drop off parcels.Use API Get District

weight	 	Int	
Weight (gram)

length	 	Int	
Length (cm)

width	 	Int	
width (cm)

height	 	Int	
height (cm)

cod_value	 	Int	
Amount cash to collect.

Maximum 5.000.000

Default value: 0

Success 200
{
                "code": 200,
                "message": "Success",
                "data":{
                "total":36300,
                "service_fee":36300,
                "insurance_fee":0,
                "pick_station_fee":0,
                "coupon_value":0,
                "r2s_fee":0,
                "document_return":0,
                "double_check":0,
                "cod_fee":0,
                "pick_remote_areas_fee":0,
                "deliver_remote_areas_fee":0,
                "cod_failed_fee":0,
                }
            }
Structure Response
Field	Description
total	
Total service

service_fee	
Service fee

insurance_fee	
Insurance fee

pick_station_fee	
Pickup fee at Station

coupon_value	
Coupon Code for discount

r2s_fee	
Fee of delivery parcel again

document_return	
Fee of document return

double_check	
Fee of check together

cod_fee	
Fee of collection COD

pick_remote_areas_fee	
Fee of pick remote areas

deliver_remote_areas_fee	
Fee of delivery remote areas

cod_failed_fee	
Fee of collection money when delivery fail

Error-Response
{
                "code": 400,
                "message": "code=400, message=Syntax error: offset=30, error=invalid character '}' after array element, internal=invalid character '}' after array element",
                "data": null
                "code_message": "USER_ERR_COMMON"
}


Get Service
API Get Service
 
Use to get list of available services from district pick up items and to district drop off items (Full information)

Caution : The API Order Info need to infusion token in header

post/get
Production
https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services
Test
https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services
Curl
curl --location --request POST 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services' \
--header 'token: 637170d5-942b-11ea-9821-0281a26fb5d4' \
--header 'Content-Type: application/json' \
--data-raw '{
	"shop_id":885,
	"from_district": 1447,
	"to_district": 1442
}'
Parameter
Field	Type	Description
token	String	
Must be sent with all client requests. This Token helps server to validate request source. Provided by GHN.

from_district	Int	
DistrictID provide to GHN

to_district	Int	
DistrictID provide to GHN

shop_id	Int	
Manage information for shop/seller

Success 200
{
    "code": 200,
    "message": "Success",
    "data":[
    {
    "service_id":53319
    "short_name":"Nhanh"
    "service_type_id":1
    },
     {
    "service_id":53320
    "short_name":"Chuẩn"
    "service_type_id":2
    },
     {
    "service_id":53330
    "short_name":""
    "service_type_id":0
    },
     {
    "service_id":53321
    "short_name":"Tiết kiệm"
    "service_type_id":3
    },
    ]
}
Structure Response
Field	Description
service_id	
Service id

short_name	
Short name

service_type_id	
Service type id

Error-Response
{
    "code": 400,
    "message": "code=400, message=Syntax error: offset=30, error=invalid character '}' after array element, internal=invalid character '}' after array element",
    "data": null
    "code_message": "USER_ERR_COMMON"
}

Get District
API Get District
 
Get GHN district/province data. This data is used to reference the District ID to create shipping order.

Caution : The API Order Info need to infusion token in header

post/get
Production
https://online-gateway.ghn.vn/shiip/public-api/master-data/district
Test
https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district
Curl
curl --location --request GET 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district' \
--header 'token: 637170d5-942b-11ea-9821-0281a26fb5d4' \
--header 'Content-Type: application/json' \
--data-raw '{
	"province_id":201
}'

Parameter
Field	Type	Description
token	String	
Must be sent with all client requests. This Token helps server to validate request source. Provided by GHN.

province_id	Int	
ProvinceID provied by GHN.

Success 200
{
    "code": 200,
    "message": "Success",
    "data":[
    {
    "DistrictID":1442
    "ProvinceID":202
    "DistrictName":"Quận 1"
    "Code":"0201"
    "Type":1
    "SupportType":0
    },
    {
    "DistrictID":1443
    "ProvinceID":202
    "DistrictName":"Quận 2"
    "Code":"0202"
    "Type":1
    "SupportType":0
    },
    {
    "DistrictID":1444
    "ProvinceID":202
    "DistrictName":"Quận 3"
    "Code":"0203"
    "Type":1
    "SupportType":0
    },
    ...
    ]
}
Structure Response
Field	Description
DistrictID	
District ID

ProvinceID	
Province ID

DistrictName	
District Name

SupportType	
Support Type

0:Lock

1:Take/Pay

2:Deliver

3:Take/Deliver/Pay

NameExtension	
Extension Name

CanUpdateCOD	
Can Update COD

true:Yes;

false:No

Status	
Status

1:Unlock

2:Lock

CreatedDate	
Created Date

UpdatedDate	
Updated Date

Error-Response
{
    "code": 400,
    "message": "code=400, message=Syntax error: offset=30, error=invalid character '}' after array element, internal=invalid character '}' after array element",
    "data": null
    "code_message": "USER_ERR_COMMON"
}

Get Ward
API Get Ward
 
Get GHN ward/province data. This API provides Ward Code to create shipping order.

Caution : The API Get Ward need to infusion token in header

post/get
Production
https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id
Test
https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id
Curl
curl --location --request POST 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id' \
--header 'token: 637170d5-942b-11ea-9821-0281a26fb5d4' \
--header 'Content-Type: application/json' \
--data-raw'{"district_id":1566}'
Parameter
Field	Type	Description
token	String	
Must be sent with all client requests. This Token helps server to validate request source. Provided by GHN.

district_id	Int	
DistrictID provied by GHN.

API Get DistrictID : https://api.ghn.vn/home/docs/detail?id=78

Success 200
{
    "code": 200,
    "message": "Success",
    "data": {
    "WardCode":510101 
    "DistrictID":1566 
    "WardName":"Phường Mỹ Bình"           
    }
    {
    "WardCode":510102   
    "DistrictID":1566 
    "WardName":"Phường Mỹ Long"           
    }
    {
    "WardCode":510103  
    "DistrictID":1566  
    "WardName":"Phường Đông Xuyên"   
        
    }
    {
    "WardCode":510104   
    "DistrictID":1566 
    "WardName":"Phường Mỹ Xuyên"   
    
    }
    ....
    
}
Structure Response
Field	Description
WardCode	
Ward Code ID

DistrictID	
District ID

WardName	
Ward Name

NameExtension	
Name Extension

CanUpdateCOD	
Can Update COD

true:Yes

false:No

SupportType	
Type

0:Lock

1:Take/Pay

2:Deliver

3:Take/Deliver/Pay

Status	
Status

1:Unlock

2:Lock

CreatedDate	
Created Date

UpdatedDate	
Updated Date

Error-Response
{
    "code": 404,
    "message": "code=404, message=Not Found",
    "data": null
}

API Get Province
API Get Province
 
Get GHN ward/province data. This API provides province to create shipping order.

Caution : The API Get Province need to infusion token in header

post/get
Production
https://online-gateway.ghn.vn/shiip/public-api/master-data/province
Test
https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province
Curl
curl --location --request GET 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province'
     --header 'Content-Type: application/json' --header 'Token: d6e3dccb-6289-11ea-8b85-c60e4edfe802 
Parameter
Field	Type	Description
token	String	
Must be sent with all client requests. This Token helps server to validate request source. Provided by GHN.

Success 200
{
    "code": 200,
    "message": "Success",
    "data": {
    "ProvinceID":201   
    "ProvinceName":"Hà Nội"   
    "Code":"4"         
    }
    {
    "ProvinceID":202   
    "ProvinceName":"Hồ Chí Minh"   
    "Code":"8"         
    }
    {
    "ProvinceID":203   
    "ProvinceName":"Đà Nẵng"   
    "Code":"511"         
    }
    {
    "ProvinceID":204   
    "ProvinceName":"Đồng Nai"   
    "Code":"61"         
    }
    ....
    
}
Structure Response
Field	Description
ProvinceID	
Province ID

ProvinceName	
Province Name

NameExtension	
Name Extension

CreatedAt	
Created At

UpdatedAt	
Updated At

CanUpdateCOD	
Can Update COD

true:Yes

false:No

Status	
Status

1:Unlock

2:Lock

Error-Response
{
    "code": 401,
    "message": "code=401, message=Token is not valid!",
    "data": null
}