export const formatDate = (input: Date): string => {
  const dateInput: string = ('' + input).split('GMT')[0];
  const yyyy_MM_dd = input.toISOString().split('T')[0];

  const hh = dateInput.split(' ')[4].split(':')[0];
  const mm = dateInput.split(' ')[4].split(':')[1];

  return `${yyyy_MM_dd} ${hh}:${mm}`;
};
