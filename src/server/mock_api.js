function question (id) {
  let sampleContent = '--the question content--';
  return {
    id,
    content: `sample-${id}: ${sampleContent}`,
    user_id: id
  }
}

export const questions = (function(count){
  let res = [];
  for(let i = 0; i < count; i++){
    res[i] = i;
  }
  return res;
}(10)).map((i)=> question(i));

export function getUser (id) {
  return {
    id,
    name: `user name - ${id}`
  }
}
export function getQuestion (id) {
  if (id === 'not-found') {
    return null
  }
  return question(id)
}
