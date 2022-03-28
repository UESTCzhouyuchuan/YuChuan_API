function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}
module.exports = function post_get_data(req) {
  const query = req.query;
  let ret = isEmptyObject(query) ? req.body : query;
  console.log('query: ', ret, new Date().toLocaleString());
  return ret;
};
