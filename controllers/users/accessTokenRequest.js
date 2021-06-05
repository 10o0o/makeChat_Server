const { Users } = require('../../models');
const jwt = require('jsonwebtoken');
const refreshTokenRequest = require('./refreshTokenRequest');
const dotenv = require("dotenv");
dotenv.config();


module.exports = async (req, res) => {
  // 헤더에 담긴 ACCESS TOKEN을 검사합니다.
  const authorization = req.headers['authorization'];
  if (!authorization) {
    res.status(400).send({ "data": null, "message": "ACCESS TOKEN이 유효하지 않습니다."  })
  }

  const token = authorization.split(' ')[1];
  const data = jwt.verify(token, process.env.ACCESS_SECRET);
  const userInfo = await Users.findOne({
    where: {userId: data.userId}
  })
  delete userInfo.dataValues.password

  const resultObj = {
    userInfo: userInfo.dataValues
  }
  
  if (userInfo) {res.status(200).json({
    accessToken: token,
    data: resultObj,
    message: "ok"
  })} else { // ACCESSTOKEN이 유효하지 않다면 REFRESHTOKEN을 체크합니다.
    return refreshTokenRequest(req, res);
  }
};
