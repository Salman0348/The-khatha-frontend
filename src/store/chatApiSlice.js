import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApiSlice = createApi({
  reducerPath: "chatApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
    credentials: "include",
  }),

  tagTypes: ["ChatMessages", "UnreadCount"],

  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (groupId) => `/groups/${groupId}/messages`,

      providesTags: (result, error, groupId) => [
        { type: "ChatMessages", id: groupId },
      ],
    }),

    sendMessage: builder.mutation({
      query: ({ groupId, message }) => ({
        url: `/groups/${groupId}/messages`,
        method: "POST",
        body: {
          message,
        },
      }),

      invalidatesTags: (result, error, { groupId }) => [
        { type: "ChatMessages", id: groupId },
        { type: "UnreadCount", id: groupId },
      ],
    }),

    getUnreadCount: builder.query({
      query: (groupId) => `/groups/${groupId}/messages/unread`,

      providesTags: (result, error, groupId) => [
        { type: "UnreadCount", id: groupId },
      ],
    }),

    markChatAsRead: builder.mutation({
      query: (groupId) => ({
        url: `/groups/${groupId}/messages/read`,
        method: "PATCH",
      }),

      invalidatesTags: (result, error, groupId) => [
        { type: "UnreadCount", id: groupId },
      ],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetUnreadCountQuery,
  useMarkChatAsReadMutation,
} = chatApiSlice;
