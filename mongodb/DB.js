const Config = require("./config-gitignore.js");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = `mongodb://${Config.user}:${Config.pwd}@${Config.host}:${Config.port}/${Config.db}`;

class DB {
  //用于实现单例模式
  static getInstance() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }
  //构造方法
  constructor() {
    this.dbClient = ""; //用于存储数据库对象
    this.connect(); //实例化的时候就连接数据库
  }

  connect() {
    let that = this;
    return new Promise((resolve, reject) => {
      if (!that.dbClient) {
        //防止数据库连接多次
        MongoClient.connect(
          url,
          { useUnifiedTopology: true },
          (error, client) => {
            if (error) {
              return reject(error);
            }
            that.dbClient = client.db(Config.dbName); //数据库对象
            resolve(that.dbClient);
          }
        );
      } else {
        resolve(that.dbClient);
      }
    });
  }

  find(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        let result = db.collection(collectionName).find(json);
        result.toArray((error, docs) => {
          if (error) {
            return reject(error);
          } else {
            resolve(docs);
          }
        });
      },err=> reject(err));
    });
  }

  insert(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).insertOne(json, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });
    });
  }

  delete(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).deleteOne(json, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });
    });
  }

  update(collectionName, oldjson, newjson) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).updateOne(
          oldjson,
          { $set: newjson },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
      });
    });
  }

  //获取数据_id
  getObjectId(id) {
    return new ObjectID(id);
  }
}

//导出数据库实例
module.exports = DB.getInstance();
