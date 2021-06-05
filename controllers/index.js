
module.exports = {
  login: require('./users/login'),
  refreshTokenRequest: require('./users/refreshTokenRequest'),
  signUp: require('./users/signUp'),
  like: require('./users/like'),
  addComment: require('./comments/addComment'),
  removeComment: require('./comments/removeComment'),
  updateComment: require('./comments/updateComment'),
  addBanWord: require('./comments/addBanWord'),
};
