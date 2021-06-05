const { Users } = require('../../models');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (req, res) => {
  if (!req.cookies.refreshToken) {res.status(400)
  .send({"data": null, "message": "REFRESH TOKEN이 없습니다!"})}

  if (req.cookies.refreshToken === 'invalidtoken') {res.status(400)
  .send({"data": null, "message": "REFRESH TOKEN이 유효하지 않습니다!"})}


  const data = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_SECRET);
  const userInfo = await Users.findOne({
    where: {userId: data.userId}
  })
  delete userInfo.dataValues.password
  const token = jwt.sign(userInfo.dataValues, process.env.ACCESS_SECRET, {
    expiresIn: '2h',
  })

  const token2 = jwt.sign(req.body, process.env.REFRESH_SECRET, {
    expiresIn: '1d'
  })
  res
  .status(200)
  .cookie('refreshToken', token2, {domain:'localhost', path : '/', secure : true, httpOnly :true, sameSite :'none'})
  .send({
    data: { "accessToken": token },
    message: 'ok'
  })
};
