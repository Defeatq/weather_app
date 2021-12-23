export function convertUnixTime(seconds) {
  const ms = new Date(seconds * 1000);
  const minutes = ms.getMinutes() > 9 ? ms.getMinutes() : '0' + ms.getMinutes();
  const hours = ms.getHours() > 9 ? ms.getHours() : '0' + ms.getHours();
  const month = getMonthName(ms.getMonth());
  const day = ms.getDate();

  return {hours, minutes, month, day}
}

function getMonthName(number) {
  switch (number) {
    case 0:
      return 'Jan'
    case 1:
      return 'Feb'
    case 2:
      return 'Mar'
    case 3:
      return 'Apr'
    case 4:
      return 'May'
    case 5:
      return 'Jun'
    case 6:
      return 'Jul'
    case 7:
      return 'Aug'
    case 8:
      return 'Sep'
    case 9:
      return 'Oct'
    case 10:
      return 'Nov'
    case 11:
      return 'Dec'
  }
}