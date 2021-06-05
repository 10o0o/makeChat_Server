const { forbiddenWord } = require('../../models');

// 금지 단어를 DB에 추가하는 부분
module.exports = async (req, res) => {
  const word = req.body.word;

  await forbiddenWord.create({
    word
  })

  res.status(200).send({
    data: word,
    message: '성공적으로 추가했습니다.'
  })
}