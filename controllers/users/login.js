const { Users } = require('../../models');
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
dotenv.config();


//로그인을 처리하는 로직입니다.
module.exports = async (req, res) => {
  // 요청의 body에 필요한 인자들이 있는지 확인합니다.
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      data: null,
      message: '이메일 혹은 비밀번호를 입력하지 않았습니다.'
    })
  }

  // 로그인 요청이 들어온 이메일이 유효한지 검사합니다.
  const userInfoWithEmail = await Users.findOne({
    where: { email: req.body.email },
  });

  if (!userInfoWithEmail) {
    return res.status(400).send({
      data: null,
      message: '회원이 아닙니다.'
    })
  }

  // 로그인 요청이 들어온 비밀번호가 유효한지 검사합니다.
  bcrypt.compare(req.body.password, userInfoWithEmail.password).then(function(result) {
    if (!result) {
      res.status(400).send({
        data: null,
        message: '비밀번호가 맞지 않습니다.'
      })
    } else { // 해당 유저 정보가 DB에 있는 경우
      // token을 생성할 때, 유저의 비밀번호 정보를 담으면 안되므로 지웁니다.
      delete userInfoWithEmail.dataValues.password;
  
      // ACCESS TOKEN 발급을 합니다.
      const token = jwt.sign(userInfoWithEmail.dataValues, process.env.ACCESS_SECRET, {
        // 만료기간은 2시간으로 설정했습니다.
        expiresIn: '2h',
      })
  
      // REFRESH TOKEN 발급을 합니다.
      const token2 = jwt.sign(req.body, process.env.REFRESH_SECRET, {
        // 만료기간은 하루로 설정했습니다.
        expiresIn: '1d'
      })
  
      // 성공적으로 로그인을 했다고 알리면서, 쿠키에는 REFRESH, 바디의 data는 ACCESS TOKEN을 실어 보냅니다.
      return res
      .status(200)
      .cookie('refreshToken', token2, {domain:'localhost', path : '/', secure : true, httpOnly :true, sameSite :'none'})
      .send({
        data: { "accessToken": token },
        message: '로그인 완료!'
      })
    }
  });
}