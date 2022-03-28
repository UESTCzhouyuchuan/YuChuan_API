const redis = require('redis')
const Condfig = {
    host: 'localhost',
    port : 6379
}

const client = redis.createClient(Condfig.port, Condfig.host);

client.on('ready',(res)=>[
    console.log(res)
])
