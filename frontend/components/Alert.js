"use client";

import { useEffect, useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import tick from "@/public/icons/tick.png";
import error from "@/public/icons/error.png";

export default function AlertBox({
  success = false,
  message = "Something went wrong",
  duration = 3000,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Fade in immediately
    setVisible(true);

    // Fade out after duration
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div className="w-fit max-w-[90%] fixed bottom-6 right-6 z-50">
      <Alert
        className={`
          flex
          gap-2
          transform transition-all duration-300 ease-out
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          ${
            success
              ? "bg-[#051b11] text-[#75b798] border-[#0f5132]"
              : "bg-[#2c0b0e] text-[#ea868f] border-[#842029]"
          }
        `}
      >
        <Image
          width={24}
          height={24}
          alt={success ? "success" : "error"}
          src={success ? tick : error}
        />
        <AlertTitle>{message}</AlertTitle>
      </Alert>
    </div>
  );
}
