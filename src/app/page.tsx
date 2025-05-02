import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to Notes App
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            A simple, clean way to organize your thoughts and ideas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Organize</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Keep all your notes in one place, organized and easily
                accessible.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Quickly find what you need with powerful search functionality.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customize</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Switch between light and dark mode for comfortable viewing.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
