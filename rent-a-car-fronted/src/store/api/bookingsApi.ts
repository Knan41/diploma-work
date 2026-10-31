import { apiSlice } from './apiSlice';
import type {
  Booking,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
} from '../../types';

export const bookingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<Booking, CreateBookingRequest>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Booking', id: 'LIST' },
        { type: 'Car', id: 'LIST' },
        'Stats',
      ],
    }),

    getMyBookings: builder.query<Booking[], void>({
      query: () => '/bookings/my',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Booking' as const, id })),
              { type: 'Booking', id: 'LIST' },
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    cancelBooking: builder.mutation<Booking, number | string>({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
        { type: 'Car', id: 'LIST' },
        'Stats',
      ],
    }),

    getAllBookings: builder.query<Booking[], string | void>({
      query: (status) => `/bookings${status ? `?status=${status}` : ''}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Booking' as const, id })),
              { type: 'Booking', id: 'LIST' },
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    updateBookingStatus: builder.mutation<Booking, UpdateBookingStatusRequest>({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
        { type: 'Car', id: 'LIST' },
        'Stats',
      ],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useCancelBookingMutation,
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
} = bookingsApi;
