const { forbiddenWord } = require("../models");

// 댓글을 달고자 하는 내용을 받아, 그 내용과 일치하는 것들이 최근 댓글에 있는지 검사
module.exports = async function forbiddenWords(context) {
  // 우선 내용 속 단어들을 찾기 위해 스페이스바 단위로 split을 합니다.
  contextArr = context.split(" ");
  
  const badWords = await forbiddenWord.findAll();

  for(const badWord of badWords) {
    // console.log(badWord.word)
    if (contextArr.includes(badWord.word)) {
      return true;
    }
  }
  
  return false;
}