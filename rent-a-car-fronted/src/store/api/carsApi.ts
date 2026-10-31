import { apiSlice } from './apiSlice';
import type {
  Car,
  CarsQueryParams,
  BookedDateRange,
  CreateCarRequest,
  UpdateCarRequest,
} from '../../types';

export const carsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCars: builder.query<Car[], CarsQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
              searchParams.set(key, String(value));
            }
          });
        }
        const qs = searchParams.toString();
        return `/cars${qs ? `?${qs}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Car' as const, id })),
              { type: 'Car', id: 'LIST' },
            ]
          : [{ type: 'Car', id: 'LIST' }],
    }),

    getCar: builder.query<Car, number | string>({
      query: (id) => `/cars/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Car', id }],
    }),

    getCarBrands: builder.query<string[], void>({
      query: () => '/cars/brands',
    }),

    getBookedDates: builder.query<BookedDateRange[], number | string>({
      query: (carId) => `/cars/${carId}/booked-dates`,
      providesTags: (_result, _error, carId) => [{ type: 'Car', id: carId }],
    }),

    createCar: builder.mutation<Car, CreateCarRequest>({
      query: (body) => ({
        url: '/cars',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Car', id: 'LIST' }, 'Stats'],
    }),

    updateCar: builder.mutation<Car, UpdateCarRequest>({
      query: ({ id, data }) => ({
        url: `/cars/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Car', id },
        { type: 'Car', id: 'LIST' },
        'Stats',
      ],
    }),

    deleteCar: builder.mutation<{ message: string }, number | string>({
      query: (id) => ({
        url: `/cars/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Car', id: 'LIST' }, 'Stats'],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarQuery,
  useGetCarBrandsQuery,
  useGetBookedDatesQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carsApi;
