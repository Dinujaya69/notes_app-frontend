"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  useGetNotesQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "@/Redex/features/noteApiSlice";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  loadFromStorage,
} from "@/Redex/features/authSlice";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";

export default function Notes() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    dispatch(loadFromStorage());
    setIsInitialized(true);
  }, [dispatch]);

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const {
    data: notes,
    isLoading,
    isError,
    refetch,
  } = useGetNotesQuery(undefined, {
    skip: !isInitialized || !isAuthenticated,
  });

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      refetch();
    }
  }, [isAuthenticated, isInitialized, refetch]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
 
      const timer = setTimeout(() => {
        router.push("/");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isInitialized, router]);

  const [addNote] = useAddNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const [form, setForm] = useState<Partial<Note>>({ title: "", content: "" });
  const [editId, setEditId] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      if (!form.title?.trim() || !form.content?.trim()) return;

      if (editId) {
        await updateNote({
          id: editId,
          title: form.title,
          content: form.content,
        }).unwrap();
      } else {
        await addNote(form).unwrap();
      }

      setForm({ title: "", content: "" });
      setEditId(null);
    } catch (error) {
      console.error("Failed to submit note:", error);
    }
  };

  const handleEdit = (note: Note) => {
    setForm({ title: note.title, content: note.content });
    setEditId(note._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id).unwrap();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  if (!isInitialized) return <p className="text-center">Initializing...</p>;

  if (!isAuthenticated) {
    return (
      <div className="text-center p-8">
        <p className="text-yellow-500 text-lg mb-2">
          Please log in to view your notes.
        </p>
        <p>Redirecting to login page...</p>
      </div>
    );
  }

  if (isLoading) return <p className="text-center">Loading notes...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load notes.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow rounded-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Notes</h2>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Content"
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
        ></textarea>
        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white"
          disabled={!form.title?.trim() || !form.content?.trim()}
        >
          {editId ? "Update Note" : "Add Note"}
        </Button>
      </div>

      <ul className="divide-y divide-gray-200">
        {notes?.map((note) => (
          <li key={note._id} className="py-4 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{note.title}</h3>
              <p className="text-gray-600">{note.content}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleEdit(note)}
                className="text-sm text-blue-500"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(note._id)}
                className="text-sm text-red-500"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
