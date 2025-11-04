'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import RoboticText from "@/components/shared/RoboticText";
import Button from "@/components/shared/Button";
import Leaderboard from "@/components/player/Leaderboard";
import { TOTAL_ROOMS, ROOM_NAMES } from "@/constants";
import { getRoomNames } from "@/lib/db/config";

export default function Home() {
  const [customNames, setCustomNames] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const loadCustomNames = async () => {
      try {
        const names = await getRoomNames();
        setCustomNames(names);
      } catch (error) {
        console.error('Error loading custom room names:', error);
      }
    };
    loadCustomNames();
  }, []);

  const getRoomDisplayName = (roomNumber: number): string => {
    return customNames[roomNumber] || ROOM_NAMES[roomNumber] || `Room ${roomNumber}`;
  };

  return (
    <div className="min-h-screen p-8">
      {/* Main Content Grid */}
      <div className="flex gap-6 max-w-[1600px] mx-auto">
        {/* Main Home Area */}
        <div className="flex-1 flex items-center justify-center">
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
                    {getRoomDisplayName(roomNum)}
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

        {/* Leaderboard Box - Right Side */}
        <div className="w-[400px] shrink-0">
          <div className="sticky top-8">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
