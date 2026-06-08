import { useQuery } from '@tanstack/react-query';
import { faqApi } from '../api/faq-api';

export const useGetFaqsQuery = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: () => faqApi.getFaqs(),
  });
};
