"use client";
import { useEffect, useState } from "react";

export default function StudyTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <p>Timer latihan: {seconds} detik</p>;
}
