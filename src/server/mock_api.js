function question (id) {
  let sampleContent = '--the question content--';
  return {
    id,
    content: `sample-${id}: ${sampleContent}`,
    user_id: id
  }
}

function user (id) {
  let sampleName = '--the user name--';
  return {
    id,
    name: `sample-${id}: ${sampleName}`
  }
}

export const questions = (function(count){
  let res = [];
  for(let i = 0; i < count; i++){
    res[i] = i;
  }
  return res;
}(10)).map((i)=> question(i));

export const users = (function(count){
  let res = [];
  for(let i = 0; i < count; i++){
    res[i] = i;
  }
  return res;
}(10)).map((i)=> user(i));

export function getUser (id) {
  return user(id);
}

export function getQuestion (id) {
  if (id === 'not-found') {
    return null
  }
  return question(id)
}
