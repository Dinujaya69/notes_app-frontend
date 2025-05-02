"use client";

import type React from "react";

import { useState } from "react";
import type { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface NoteFormProps {
  initialData: Partial<Note>;
  onSubmit: (data: Partial<Note>) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export default function NoteForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
}: NoteFormProps) {
  const [formData, setFormData] = useState<Partial<Note>>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Note" : "Create Note"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Note title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content || ""}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Write your note here..."
              rows={5}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!formData.title?.trim() || !formData.content?.trim()}
          >
            {isEditing ? "Update" : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
