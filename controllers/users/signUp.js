const bcrypt = require('bcrypt');
const { Users } = require('../../models');
const dotenv = require("dotenv");
dotenv.config();


// 신규 회원의 회원가입을 처리하는 로직입니다.
module.exports = async (req, res) => {
  
  // 회원가입 요청이 들어온 정보를 저장합니다.
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const nickname = req.body.nickname;
  
  // 만약 필요한 정보가 들어오지 않는다면 에러 처리를 해줍니다.
  if (!nickname | !name | !password | !email) {
    console.log(nickname, name, password, email)
    return res.status(400).send({
      data: null,
      message: '이메일, 패스워드, 이름, 닉네임을 전부 입력해야 합니다.'
    })
  }
  
  // DB에 해당 유저 정보가 있다면 이미 있는 회원이라고 리턴합니다.
  const conflictUserWithEmail = await Users.findOne({
    where: { email },
  });
  
  if (conflictUserWithEmail) {
    return res.status(409).send({
      data: null,
      message: '이미 사용중인 이메일입니다.'
    })
  }
  
  const conflictUserWithNickname = await Users.findOne({
    where: { nickname },
  });
  
  if (conflictUserWithNickname) {
    return res.status(409).send({
      data: null,
      message: '이미 사용중인 닉네임입니다.'
    })
  }
  
  
  
  
  await bcrypt.hash(password, 5, async function(err, hash) {
    const user = {
      email,
      password: hash,
      name,
      nickname
    }

    await Users.create(user)

    console.log(user);
    delete user.password;
    
  
    return res.status(200).send({
      data: user,
      message: '회원가입이 완료되었습니다.'
    });
  })
}