import apiClient from '@/api/client';
import { ResponseApi } from '@/api/types';
import { HomeAggregate } from '../types';

export const homeApi = {
  getHomeAggregate: async (): Promise<ResponseApi<HomeAggregate>> => {
    const { data } = await apiClient.get<ResponseApi<HomeAggregate>>('/v1/home');
    return data;
  },
};
