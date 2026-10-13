import apiClient from './client';

export type OccupationOption = {
  id: string;
  code: string;
  name: string;
};

export type OccupationListResponse = {
  status: string;
  message: string;
  data: {
    items: OccupationOption[];
  };
};

export const occupationApi = {
  getOccupations: async (): Promise<OccupationListResponse> => {
    const { data } = await apiClient.get<OccupationListResponse>('/v1/occupations', {
      noNeedAuth: true,
    });

    return data;
  },
};
