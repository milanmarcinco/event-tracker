export const errorHandler = (err: any) => {
  if (err.response) {
    throw new Error(err.response.data.error);
  } else {
    throw new Error(err.message);
  }
};
