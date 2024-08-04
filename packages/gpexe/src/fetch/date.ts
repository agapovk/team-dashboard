import { format } from 'date-fns';

export const date = (str: string): Date => {
  const timedate = format(new Date(str), 'yyyy-MM-dd HH:mm:ss');
  // console.log(timedate);
  return new Date(timedate);
  // return parseJSON(str);
  // return new Date(str);
};
