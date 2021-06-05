const { Users, Comments } = require('../../models');
const jwt = require('jsonwebtoken')


//로그인을 처리하는 로직입니다.
module.exports = async (req, res) => {
  // 요청에서 ACCESS TOKEN을 검사하여 유저를 특정합니다.
  const authorization = req.headers['authorization'];
  if (!authorization) {
    res.status(400).send({ "data": null, "message": "ACCESS TOKEN이 유효하지 않습니다."  })
  }

  const token = authorization.split(' ')[1];
  const data = jwt.verify(token, process.env.ACCESS_SECRET);
  // console.log(data)
  const userInfo = await Users.findOne({
    where: {id: data.id}
  })

  // 요청에서 수정하고자 하는 내용이 없으면 에러를 발생합니다.
  if (!req.body.context) {
    res.status(400).send({
      data: null,
      message: '내용(context)가 없습니다.'
    })
  }

  // Comment의 ID를 받아 특정 Comment를 수정합니다.
  // 그 전에 그 댓글이 해당 유저가 작성한 댓글인지 확인합니다.
  const comment = await Comments.findOne({where: {
    id: req.body.id,
  }})

  if(!comment) {
    res.status(400).send({
    data: null,
    message: '해당 댓글이 없습니다.'
  })}

  if (comment.userId === userInfo.id) {
    await Comments.update({
      context: req.body.context,
    }, { where: {
      id: req.body.id,
    }})

    comment.context = req.body.context;

    res.status(200).send({
      data: comment,
      message: '성공적으로 수정되었습니다.'
    })
  } else {
    res.status(401).send({
      data: comment,
      message: '해당 댓글을 수정할 권한이 없습니다.'
    })
  }
}