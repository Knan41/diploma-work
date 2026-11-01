import { apiSlice } from './apiSlice';
import type { StatsResponse } from '../../types';

export const statsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<StatsResponse, void>({
      query: () => '/stats',
      providesTags: ['Stats'],
    }),
  }),
});

export const { useGetStatsQuery } = statsApi;
