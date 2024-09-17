import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">tonal</h1>
      <p className="mb-8 text-fd-muted-foreground">A music theory library</p>

      <p className="">
        <Link
          href="/docs"
          className="text-fd-foreground font-semibold underline"
        >
          Documentation
        </Link>{" "}
      </p>
    </main>
  );
}
