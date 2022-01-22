export function recursiveForEach(iterable, callback) {
  const array = formatArray(iterable);

  if (array[0]) {
    callback(array[0]);
    recursiveForEach(array.splice(1), callback);
  }
}

export function formatArray(iterable) {
  return [...iterable]
}