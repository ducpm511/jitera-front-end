const decimalToTime = (decimalValue: number) => {
    const hours = Math.floor(decimalValue);
    const remainingMinutes = (decimalValue - hours) * 60;
    const minutes = Math.floor(remainingMinutes);
    const remainingSeconds = (remainingMinutes - minutes) * 60;
    const seconds = Math.round(remainingSeconds);
  
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
    return formattedTime;
}
export default decimalToTime