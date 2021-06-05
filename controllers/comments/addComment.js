const { Users, Comments } = require('../../models');
const jwt = require('jsonwebtoken');
const { preventPapering } = require('../../utills');
const forbiddenWords = require('../../utills/forbiddenWords');


//로그인을 처리하는 로직입니다.
module.exports = async (req, res) => {
  // 요청에서 ACCESS TOKEN을 검사하여 유저를 특정합니다.
  const authorization = req.headers['authorization'];
  if (!authorization) {
    res.status(400).send({ "data": null, "message": "ACCESS TOKEN이 유효하지 않습니다."  })
  }

  const token = authorization.split(' ')[1];
  const data = await jwt.verify(token, process.env.ACCESS_SECRET, (err, data) => {
    if(err) {
      return res.status(400).send({
        data: null,
        message: '토큰이 만료되었습니다.'
      })
    }
    return data;
  });
  console.log(data)
  const userInfo = await Users.findOne({
    where: {id: data.id}
  })

  // 해당 유저의 댓글의 내용이 없을 시 에러 발생
  if (!req.body.context) res.status(400).send({
    data: null,
    messgae: '내용을 입력하세요(context)'
  })

  // 도배 검사
  const isPapering = await preventPapering(req.body.context);
  if (isPapering) {
    return res.status(400).send({
      data: null,
      message: '최근 댓글 10개 중 3개가 같은 내용입니다.(도배)'
    })
  }

  // 금지어 포함 검사
  const isForbiddenWord = await forbiddenWords(req.body.context);
  if (isForbiddenWord) {
    return res.status(400).send({
      data: null,
      message: '금지어를 포함하면 안됍니다.'
    })
  }


  // DB에 댓글을 저장합니다.
  const comment = {userId: userInfo.id, context: req.body.context}
  await Comments.create(comment)

  return res.status(200).send({
    data: comment,
    message: '댓글이 저장되었습니다.'
  })
}