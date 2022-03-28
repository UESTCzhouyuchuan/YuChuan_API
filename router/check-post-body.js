module.exports = function checkPostBody(req, res) {
  let retJson = { msg: 'ok', data: req.body };

  if (Object.keys(req.body).length === 0) {
    retJson.msg = 'you body is empty。Content—Tpye must set to application/json.';
    res.status(400).json(retJson);
  } else {
    res.json(retJson);
  }
};
