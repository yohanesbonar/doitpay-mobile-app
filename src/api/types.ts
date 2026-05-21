export type ResponseApi<T> = {
  data: T;
  message: string;
  status: string;
};

export type ResponseListApi<T> = {
  data: {
    items: T[];
    nextCursor: string | null;
  };
  message: string;
  status: string;
};
