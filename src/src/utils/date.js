export const getPostDate = (date) => {
  if (!date) return "02/06/2023"

  const value = new Date(date.seconds * 1000);
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(value);
  return formattedDate;
}