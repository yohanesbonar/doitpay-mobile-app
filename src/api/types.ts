export type ResponseApi<T> = {
  data: T;
  message: string;
  status: string;
};

export type ResponseListApi<T> = {
  data: {
    items: T[];
  };
  message: string;
  status: string;
};
