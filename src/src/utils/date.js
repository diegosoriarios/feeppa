export const getPostDate = (date) => {
  if (!date) return "02/06/2023"

  const value = new Date(date.seconds * 1000);
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

  if (!date.seconds) {
    var datum = Date.parse(date);
    const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(datum);
    return formattedDate;
  }
  
  const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(value);
  return formattedDate;
}