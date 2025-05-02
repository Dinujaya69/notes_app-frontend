import { apiSlice } from "@/Redex/apiSlice";
import { Note } from "@/types";

export const notesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<Note[], void>({
      query: () => "/notes",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Notes" as const, id: _id })),
              { type: "Notes" as const, id: "LIST" },
            ]
          : [{ type: "Notes" as const, id: "LIST" }],
    }),
    getNote: builder.query<Note, string>({
      query: (id) => `/notes/${id}`,
      providesTags: (result, error, id) => [{ type: "Notes" as const, id }],
    }),
    addNote: builder.mutation<Note, Partial<Note>>({
      query: (note) => ({
        url: "/notes",
        method: "POST",
        body: note,
      }),
      invalidatesTags: [{ type: "Notes" as const, id: "LIST" }],
    }),
    updateNote: builder.mutation<Note, Partial<Note> & { id: string }>({
      query: ({ id, ...note }) => ({
        url: `/notes/${id}`,
        method: "PUT",
        body: note,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Notes" as const, id },
      ],
    }),
    deleteNote: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Notes" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNoteQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
