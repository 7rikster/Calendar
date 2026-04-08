import Calendar from "@/components/Calendar/Calendar";

export default function Home() {
  return (
    <main className="flex-1 flex items-start justify-center bg-background transition-colors duration-300">
      <Calendar />
    </main>
  );
}
