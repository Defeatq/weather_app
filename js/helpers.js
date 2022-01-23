export function recursiveForEach(iterable, callback) {
  const array = [...iterable];

  if (!array[0]) {
    return
  }

  callback(array[0]);
  recursiveForEach(array.splice(1), callback);
}