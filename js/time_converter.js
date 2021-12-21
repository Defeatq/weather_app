export function convertUnixTime(seconds) {
  const ms = new Date(seconds * 1000);
  const minutes = ms.getMinutes() > 9 ? ms.getMinutes() : '0' + ms.getMinutes();
  const hours = ms.getHours() > 9 ? ms.getHours() : '0' + ms.getHours();

  return `${hours}:${minutes}`
}