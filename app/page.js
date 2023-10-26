import WebSocketPage from "@/pages/websocket";
import Image from "next/image";
import { Button } from "@nextui-org/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-l from-[#178DE4] via-[#1D9DDD] to-[#34E3C4]">
      <WebSocketPage />
    </main>
  );
}
