const express = require('express')
const router = express.Router()
const get_unicode_info = require('../mysql/get_unicode_info.js')
const post_get_data = require('../utils/post_get_data')
const key_info = require('../mysql/key_info')
const table = 'skin_tone_emojis'
router.all('/key', function(req, res) {
  const reqData = post_get_data(req)
  const key = reqData.key
  const columns = reqData.columns
  key_info(key, columns, table).then(
    result => res.json(result),
    err => res.status(500).send(String(err))
  )
})
router.all('/', function(req, res) {
  const query = post_get_data(req)
  let unicode = query.unicode
  const columns = query.columns
  let sendJson = { errMsg: '', unicode_info: [] }
  if (unicode == null) {
    // 判断unicode参数为空
    sendJson.errMsg = 'unicode value is empty!!'
    res.status(400).json(sendJson)
  } else if (
    typeof unicode !== 'string' &&
    unicode instanceof Array === false
  ) {
    sendJson.errMsg = 'unicode type must be string or array'
    res.status(400).json(sendJson)
  } else {
    if (typeof unicode === 'string') {
      unicode = [unicode]
    }
    get_unicode_info(unicode, columns, table).then(
      data => {
        sendJson.unicode_info = data
        sendJson.errMsg = 'ok'
        res.json(sendJson)
      },
      err => {
        sendJson.errMsg = err
        res.status(500).json(sendJson)
      }
    )
  }
})
module.exports = router
