const { Users, Comments, LikeOrDislike } = require('../../models');
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

  // body에 필요 인자가 있는지 확인합니다.
  if (!req.body.commentId || !req.body.userLike) {
    res.status(400).send({
      data: null,
      message: '해당 댓글 정보(commentId)와 좋아요 싫어요 유무(likeOrDislike)가 없습니다.'
    })
  }

  // console.log(req.body.userLike)

  // userLike 인자가 '1'(좋아요) 혹은 '-1'(싫어요) 로 들어오는지 체크합니다.
  if (req.body.userLike !== '-1' && req.body.userLike !== '1') {
    res.status(400).send({
      data: null,
      message: 'userLike인자는 -1 혹은 1이여야 합니다.'
    });
  }

  // 해당 유저와 해당 코멘트의 DB관계를 보고 수정합니다.
  const like = await LikeOrDislike.findOne({
    where: {userId: userInfo.id, commentId: req.body.commentId}
  })

  const comment = await Comments.findOne({
    where: {
      id: req.body.commentId,
    }
  })

  if (!comment) {
    res.status(400).send({
      data: null,
      message: '해당 댓글이 없습니다.'
    })
  }

  // console.log(userInfo.id, like, comment.id);

  if (!like) { // 만약 해당 관계가 없다면, 새로 추가해서 만들어줍니다.
    const newLike = {
      userId: userInfo.id,
      commentId: comment.id,
      userLike: req.body.userLike,
    };
    await LikeOrDislike.create(newLike, {
      include: [Users, Comments]
    });
    res.status(200).send({
      data: newLike,
      message: '성공적으로 생성되었습니다.'
    })
  } else { // 해당 관계가 있다면, 업데이트 시켜줍니다.
    const DBcomment = await LikeOrDislike.findOne({
      where: {
      userId: userInfo.id,
      commentId: comment.id,
    }}, {
      include: [Users, Comments],
    });

    // console.log(DBcomment);
    DBcomment.userLike = req.body.userLike;
    await DBcomment.save();

    res.status(200).send({
      data: DBcomment,
      message: '성공적으로 업데이트 하였습니다.'
    })
  }
}