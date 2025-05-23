## Cấu trúc dự án

```shell
src
|-- config  # cấu hình
|-- controllers #xử lý các request từ client: + Nhận dữ liệu đầu vào (request) + Gọi service xử lý logic + Trả về      response         
|-- middlewares # Xử lý trung gian giữa request và response. Ví dụ: + Xác thực (authentication): kiểm tra JWT + Phân quyền (authorization): chỉ admin được phép truy cập route nào đóLog request + Xử lý lỗi toàn cục (error handler)
|-- models # chứa các định nghĩa mô hình dữ liệu: Khai báo cấu trúc dữ liệu dùng với cơ sở dữ liệu: + Với MongoDB: dùng Mongoose schema + Với SQL: dùng Sequelize/Prisma model
|-- providers #đẩy dịch vụ bên thứ 3 Kết nối với các dịch vụ ngoài như: Firebase + AWS S3 + Google Maps API + Twilio (SMS) + Mailgun (email)
|-- routes #Chứa các route để FE gọi, thường chia theo chức năng (user.route.js, auth.route.js, ...) + Gán controller cho route +Gán middleware cho route nếu cần
|-- services #xử lí logic rồi gọi đến model: + Kiểm tra điều kiện + Tương tác với model + Tính toán/định dạng dữ liệu
|-- sockets #xử lí realtime chat, thông báo...,Quản lý danh sách client
|-- utils  # bổ sung thuật toán,  biến tĩnh, những value đã fix, các hàm xử lý chung: formatDate, slugify, randomString + Các hằng số (constant): trạng thái, vai trò,...
`-- validations #Kiểm tra dữ liệu đầu vào + Dùng Joi, Yup, express-validator để validate body, params,... + Trả lỗi nếu không đúng định dạng
|-- server.js
```

## 2. Babel 
- Chuyển đổi nó về phiên bản JavaScript cũ hơn (ES5) để trình duyệt cũ hơn có thể hiểu được

1 . Thư viện cần cài
```javscript
  yarn add @babel/runtime
  yarn add -D @babel/cli @babel/core 
  yarn add -D @babel/eslint-parser
  yarn add -D @babel/node
  yarn add -D @babel/plugin-transform-runtime
  yarn add -D @babel/preset-env
  yarn add -D babel-plugin-module-resolver
```

2. 
```javascript
  "lint": "eslint src --ext js --report-unused-disable-directives --max-warnings 0",
  "clean": "rm -rf build && mkdir build", // xóa rồi tạo lại thư mục build 
  "build-babel": "babel ./src -d ./build/src",// biên dịch từ thư mục src snag build/src
  "build": "yarn clean && yarn build-babel",//gọi 2 script clean và build
  "production": "npm run build && node ./build/src/server.js",//dùng để chạy môi trường production  
  "dev": "nodemon --exec babel-node ./src/server.js"
```

3. Config babel
```javascript
{
  "presets": ["@babel/preset-env"], // Biên dịch JS hiện đại về JS tương thích 
  "plugins": [
    ["@babel/transform-runtime"],//	Tối ưu helper + tránh ảnh hưởng global
    ["module-resolver", { "alias": { "~": "./src" } }] //Import module dễ dàng hơn với đường dẫn ngắn gọn
  ]
}
```
## 3. MongoDB
- embedding and referenced
- embedding dùng để nhúng iframe hoặc vd từ yt vào web.
- reference tham chiếu cho phép làm việc trực tiếp với đối tượng gốc.
 
**Sự khác nhau của MongoDB và Mongoose**
1. MongoDB (Database)
    Là nơi lưu trữ thực tế dữ liệu.

    Gồm: Database → Collection → Document (dữ liệu dạng JSON).

    Có thể dùng trực tiếp qua:

    + MongoDB Shell
    + MongoDB Compass
    + MongoDB Node Driver (mongodb npm package)

2. Mongoose (ODM cho MongoDB)
    - Thư viện giúp bạn định nghĩa Schema, Model, hỗ trợ validation, middleware, và nhiều tính năng cao cấp.
    - Giúp thao tác MongoDB có cấu trúc rõ ràng, dễ kiểm soát dữ liệu.
    - Tạo cảm giác như bạn đang làm việc với ORM trong SQL.
4. Thư viện cần cài
  ``` javascript
    yarn add dotenv --save-dev //đọc file .env, tải các dòng file đó vào biến process.env vì .env lưu dữ liệu nhạy cảm
    yarn add async-exit-hook // hỗ trợ async/await khi chương trình thoát, kiểm soát tài nguyên khi thoát
  ```
3. Kết nối
  trong file monggodb
  ```javascript
  const monggoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,//đảm bảo tương thích
    strict: true, //Bắt lỗi nếu dùng lệnh không hợp lệ trong API
    deprecationErrors: true //Bắt lỗi nếu dùng tính năng sắp bị loại bỏ
  }
  })

  // Kết nối tới Database
    export const CONNECT_DB = async () => {
  // Gọi  kết nối đến MongoDB với URI dã được khai báo của monggoClientInstance
  await monggoClientInstance.connect()
  // Kết nối thành công thì lấy ra database theo tên và gán ngược nó lại vào biến trelloDatabaseInstance ở trên của ta
  trelloDatabaseInstance = monggoClientInstance.db(env.DATABASE_NAME)
  }

  // Đóng kết nối tới Database
  export const CLOSE_DB = async () => {
  await monggoClientInstance.close()
  }
  //Funtcion GET_DB (KHÔNG async) này có nhiệm vụ export ra cái Trello Database instance sau khi đã connect thành công tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong nhiều code.
  // Lưu ý phải đảm bảo chỉ luôn gọi cái Get_DB này sau khi đã kết nối thành công tới MongoDB
  
  ```


## 4.   