const { default: axios } = require('axios');
const querys = require('./querys')
const bodys = {
  'userQuestionProgress': {
    "operationName": "userQuestionProgress",
    "variables": {
        "userSlug": ''
    },
}
}
const url = "https://leetcode-cn.com/graphql/"
async function userQuestionProgress(username) {
  const type = 'userQuestionProgress'
  const response = await baseFetch(type, username);
  const userProfileUserQuestionProgress = response.data.data.userProfileUserQuestionProgress;
  const ret = { isUser: true, username: username };
  if (userProfileUserQuestionProgress.numAcceptedQuestions.length === 0) {
    ret.isUser = false;
  } else {
    const diffs = [{ count: 0, total: 0 }, { count: 0, total: 0 }, { count: 0, total: 0 }];
    let count = 0, total = 0,ctn;
    userProfileUserQuestionProgress.numAcceptedQuestions.forEach((value, index) => {
      ctn = value.count;
      diffs[index].count = ctn;
      count += ctn;
      total += ctn;
      diffs[index].total += ctn;
    });
    userProfileUserQuestionProgress.numFailedQuestions.forEach((value, index) => {
      ctn = value.count;
      diffs[index].total += ctn;
      total += ctn;
    });
    userProfileUserQuestionProgress.numUntouchedQuestions.forEach((value, index) => {
      ctn = value.count;
      diffs[index].total += ctn;
      total += ctn;
    });
    ret.total = total;
    ret.count = count;
    ret.easy = diffs[0];
    ret.medium = diffs[1];
    ret.hard = diffs[2];
  }
  return ret;
}

function baseFetch(type, username) {
  const body = bodys[type]
  body.query = querys[type]
  body.variables.userSlug = username;
  //console.log(body)
  return axios.get(url,{data: body})
}
module.exports = {
  userQuestionProgress
}