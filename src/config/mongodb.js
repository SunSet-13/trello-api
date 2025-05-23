
import { env } from '~/config/environment.js' // Import biến môi trường từ file config
import { MongoClient, ServerApiVersion } from 'mongodb'
// Khởi tạo một đối tượng trelloDatabaseInstance ban đầu là null (vì chưa kết nối)
let trelloDatabaseInstance = null

// lưu ý: cái serverApi có từ phiên bản MongoDB 5.0 trở lên, có thể ko dùng nó,
// nếu dùng nó là ta sẽ chỉ định một cái Stable APi version của MongoDB
// Hàm khởi tạo đối tượng để kết nối đến MongoDB
// Tham khảo thêm: https://www.mongodb.com/docs/drivers/node/current/fundamentals/stable-api/
const monggoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
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
  console.log('code chạy vào Close này')
  await monggoClientInstance.close()
}

//Funtcion GET_DB (KHÔNG async) này có nhiệm vụ export ra cái Trello Database instance sau khi đã connect thành công tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong nhiều code.
// Lưu ý phải đảm bảo chỉ luôn gọi cái Get_DB này sau khi đã kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to database first')
  return trelloDatabaseInstance
}

