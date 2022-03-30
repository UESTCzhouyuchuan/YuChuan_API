const router = require('express').Router();
const post_get_data = require('../utils/request-data.js');

const { getDataFromLC, formSvg } = require('../lc-stats/index.js')
router.all('/', async (req, res) => {
  const query = post_get_data(req);
  const username = query.username;
  if (typeof username !== 'string' || !username) {
    res.sendStatus(404);
    res.send();
    return;
  }
  const data = await getDataFromLC(username);
  //console.log(data)
  if (!data.isUser) {
    res.sendStatus(404);
    res.send();
    return;
  }
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('Age', 0);
  res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8');
  res.setHeader('Date', new Date().toUTCString());
  res.send(formSvg(data));
})
module.exports = router;