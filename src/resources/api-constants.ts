const baseUrl = 'http://exampleurl';

export const getData = (userId: number): string => `${baseUrl  }/data/${  userId}`;
