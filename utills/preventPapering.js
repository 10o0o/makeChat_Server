const { Comments } = require("../models");

// 댓글을 달고자 하는 내용을 받아, 그 내용과 일치하는 것들이 최근 댓글에 있는지 검사
module.exports = async function preventPapering (context) {
  // 일치하는 항목의 개수
  let count = 0;

  // DB내의 댓글 조회(생성된 날짜 순으로 뒤에서 10개)
  const comments = await Comments.findAll({
    offset: 0,
    limit: 10,
    order: [["createdAt", "desc",]]
  })

  // 해당 10개의 댓글 중 해당 내용이 포함된 댓글의 수 count
  for (const comment of comments) {
    if (comment.context.includes(context)) count++
  }

  // 만약 10개 중 3개가 넘는다면 도배로 간주하여 false 리턴
  if (count >= 3) {
    return true;
  }
  
  return false;
}