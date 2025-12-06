export const formatDate = (date) => {
    const now = new Date(date)
    const utc = inputDate.getTime() + (inputDate.getTimezoneOffset() * 60 * 1000);
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const kstDate = new Date(utc + KR_TIME_DIFF);

    const year = kstDate.getFullYear()
    const month = String(kstDate.getMonth() + 1).padStart(2, '0')
    const day = String(kstDate.getDate()).padStart(2, '0')
    const hours = String(kstDate.getHours()).padStart(2, '0')
    const minutes = String(kstDate.getMinutes()).padStart(2, '0')
    const seconds = String(kstDate.getSeconds()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    return formattedDate
}