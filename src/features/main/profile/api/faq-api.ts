import apiClient from '@/api/client';
import { ResponseApi } from '@/api/types';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
};

export type GetFaqsResponse = ResponseApi<{ items: FaqItem[] }>;

export const faqApi = {
  getFaqs: async (): Promise<GetFaqsResponse> => {
    const { data } = await apiClient.get<GetFaqsResponse>('/v1/faqs');
    return data;
  },
};
