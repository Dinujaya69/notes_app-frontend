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
  selectIsAuthenticated,
  loadFromStorage,
} from "@/Redex/features/authSlice";
import type { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import NoteForm from "@/components/common/note-form";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Notes() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(loadFromStorage());
    setIsInitialized(true);
  }, [dispatch]);

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
        router.push("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isInitialized, router]);

  const [addNote] = useAddNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const [form, setForm] = useState<Partial<Note>>({ title: "", content: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (noteData: Partial<Note>) => {
    try {
      if (!noteData.title?.trim() || !noteData.content?.trim()) return;

      if (editId) {
        await updateNote({
          id: editId,
          title: noteData.title,
          content: noteData.content,
        }).unwrap();
      } else {
        await addNote(noteData).unwrap();
      }

      setForm({ title: "", content: "" });
      setEditId(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to submit note:", error);
    }
  };

  const handleEdit = (note: Note) => {
    setForm({ title: note.title, content: note.content });
    setEditId(note._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id).unwrap();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const filteredNotes = notes?.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isInitialized)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Initializing...</p>
      </div>
    );

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert variant="default" className="max-w-md mx-auto">
          <AlertDescription>
            Please log in to view your notes. Redirecting to login page...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading notes...</p>
      </div>
    );

  if (isError)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertDescription>Failed to load notes.</AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">My Notes</h1>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                setForm({ title: "", content: "" });
                setEditId(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>

        {isFormOpen && (
          <NoteForm
            initialData={form}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditId(null);
              setForm({ title: "", content: "" });
            }}
            isEditing={!!editId}
          />
        )}

        {filteredNotes && filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {filteredNotes.map((note) => (
              <Card key={note._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>{note.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-muted-foreground whitespace-pre-wrap break-words">
                    {note.content}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 text-xs text-muted-foreground border-t">
                  <span>
                    {note.createdAt &&
                      formatDistanceToNow(new Date(note.createdAt), {
                        addSuffix: true,
                      })}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(note)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(note._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No notes match your search."
                : "You don't have any notes yet."}
            </p>
            {!isFormOpen && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setForm({ title: "", content: "" });
                  setEditId(null);
                  setIsFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first note
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
