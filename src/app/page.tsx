import Link from "next/link";
import RoboticText from "@/components/shared/RoboticText";
import Button from "@/components/shared/Button";
import { TOTAL_ROOMS, ROOM_NAMES } from "@/constants";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <RoboticText size="2xl" glow className="mb-4">
            <h1 className="text-6xl font-bold mb-2">ESCAPE ROOM</h1>
            <h2 className="text-3xl">CHALLENGE SYSTEM</h2>
          </RoboticText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Array.from({ length: TOTAL_ROOMS }, (_, i) => i + 1).map((roomNum) => (
            <Link key={roomNum} href={`/room/${roomNum}`}>
              <div className="card-hover cursor-pointer">
                <h3 className="text-2xl font-bold mb-2 text-secondary">
                  {ROOM_NAMES[roomNum] || `Room ${roomNum}`}
                </h3>
                <p className="text-primary/70">Click to enter Room {roomNum}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/admin">
            <Button variant="secondary" size="lg">
              Admin Panel
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-primary/50 text-sm">
            System ready • {TOTAL_ROOMS} rooms active
          </p>
        </div>
      </div>
    </div>
  );
}
