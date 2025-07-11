import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const activities = [
  "Hike Max Patch",
  "Dip in the Hot Springs",
  "Explore the Laurel River Trail",
  "Attend a local music jam",
  "Visit a historic barn",
  "Shop in downtown Marshall",
  "Tour Mars Hill University",
  "Take a photo on the Appalachian Trail",
  "Buy from a local farmer's market",
  "Pick blueberries at Broadwing Farm",
  "Enjoy a coffee in Hot Springs",
  "Attend a festival or fair",
  "Float the French Broad River",
  "Visit the Bailey Mountain Preserve",
  "Go horseback riding",
  "Check out the arts in Marshall",
  "Visit a local brewery",
  "Camp in Pisgah National Forest",
  "See wildflowers in bloom",
  "Catch a mountain sunset",
  "Try a local restaurant",
  "Find a waterfall",
  "Go fly fishing",
  "Take a scenic drive",
  "Do yoga with a mountain view",
  "Explore Big Pillow Brewing",
  "Take a photo at Lovers Leap",
  "Learn about Cherokee history",
  "Buy handmade crafts from local artists",
  "Read a book at the Hot Springs Library",
  "Stargaze on a clear night",
  "Take a pottery class",
  "Watch live music at Zuma Coffee",
  "Ride a mountain bike trail",
  "Spot a deer or wild turkey",
  "Photograph a sunrise",
  "Explore the Shelton Laurel Backcountry",
  "Visit the Madison County Courthouse",
  "Try a homemade pie from a local diner",
  "Visit the Appalachian Barn Alliance exhibit",
  "Take a scenic train ride (if available)"
];

function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getSundaySeed() {
  const now = new Date();
  const day = now.getDay();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - day);
  return sunday.toDateString();
}

function getWinningLines() {
  const lines = [];
  for (let i = 0; i < 5; i++) {
    lines.push([...Array(5)].map((_, j) => i * 5 + j));
    lines.push([...Array(5)].map((_, j) => j * 5 + i));
  }
  lines.push([0, 6, 12, 18, 24]);
  lines.push([4, 8, 12, 16, 20]);
  return lines;
}

export default function MadisonCountyBingo() {
  const [board, setBoard] = useState([]);
  const [checked, setChecked] = useState(Array(25).fill(false));
  const [photoURLs, setPhotoURLs] = useState(Array(25).fill(null));
  const [bingo, setBingo] = useState(false);
  const [winningSquares, setWinningSquares] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const seed = getSundaySeed();
    const seededShuffle = shuffle([...activities]);
    const newBoard = seededShuffle.slice(0, 24);
    newBoard.splice(12, 0, "Free Space");
    setBoard(newBoard);
    setChecked(prev => {
      const newChecked = [...Array(25).fill(false)];
      newChecked[12] = true;
      return newChecked;
    });
  }, []);

  useEffect(() => {
    const lines = getWinningLines();
    for (const line of lines) {
      if (line.every(i => checked[i])) {
        setBingo(true);
        setWinningSquares(line);
        if (audioRef.current) {
          audioRef.current.play();
        }
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
        });
        break;
      }
    }
  }, [checked]);

  const handleUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newPhotoURLs = [...photoURLs];
      newPhotoURLs[index] = url;
      setPhotoURLs(newPhotoURLs);

      const newChecked = [...checked];
      newChecked[index] = true;
      setChecked(newChecked);
    }
  };

  return (
    <div className="p-4 relative">
      <h1 className="text-3xl font-bold text-center mb-6">Madison County Bingo</h1>

      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg" preload="auto" />

      {bingo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: 3 }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="text-4xl font-bold text-yellow-400 bg-black bg-opacity-80 px-10 py-6 rounded-xl shadow-lg">
            🎉 BINGO! 🎉
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-5 gap-2">
        {board.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
          >
            <Card className={`relative h-32 text-center ${checked[index] || activity === "Free Space" ? "bg-green-200" : ""} ${winningSquares.includes(index) ? "ring-4 ring-yellow-400" : ""}`}>
              <CardContent className="flex flex-col items-center justify-center h-full">
                <p className="text-sm font-medium mb-2">{activity}</p>
                {activity === "Free Space" ? null : (
                  <AnimatePresence mode="wait">
                    {checked[index] ? (
                      <motion.img
                        key="image"
                        src={photoURLs[index]}
                        alt="activity proof"
                        className="w-full h-16 object-cover rounded"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <Input key="input" type="file" accept="image/*" onChange={(e) => handleUpload(index, e)} />
                    )}
                  </AnimatePresence>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button onClick={() => {
          const newBoard = shuffle(activities).slice(0, 24);
          newBoard.splice(12, 0, "Free Space");
          setBoard(newBoard);
          const resetChecked = Array(25).fill(false);
          resetChecked[12] = true;
          setChecked(resetChecked);
          setPhotoURLs(Array(25).fill(null));
          setBingo(false);
          setWinningSquares([]);
        }}>Reset Board</Button>
      </div>
    </div>
  );
}
