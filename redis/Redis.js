const redis = require('redis');
const Condfig = {
  host: 'localhost',
  port: 6379,
};

class Redis{
  //用于实现单例模式
  static getInstance() {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  }
  //构造方法
  constructor() {
    this.dbClient = ""; //用于存储Redis对象
    this.connect(); //实例化的时候就连接数据库
  }
  connect(){
    let that = this;
    return new Promise((resolve, reject) => {
      if (!that.dbClient) {
        //防止数据库连接多次
        const client = redis.createClient(Condfig);
        client.on('connect',(err)=>{
          if (err) {
            return reject(err);
          }
          that.dbClient = client;
          resolve(that.dbClient);
        })
      } else {
        resolve(that.dbClient);
      }
    });
  }
  set(key, value){
    return this.commands('set', key, value)
  }
  exists(key){
    return this.commands('exists', key)
  }
  get(key){
    return this.commands('get', key)
  }
  expire(key, second){
    return this.commands('expire', key, second)
  }
  del(key){
    return this.commands('del', key)
  }
  commands(name, ...args){
    return this.operate((client, callback)=>{
      client[name](...args,callback)
    })
  }
  async operate(fn){
    const client = await this.connect();
    return new Promise((resolve, reject)=>{
      fn(client,(err,data)=>{
        if(err){
          return reject(err)
        }else{
          resolve(data)
        }
      })
    })
  }
}

//导出数据库实例
module.exports = Redis.getInstance();
