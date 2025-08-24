"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade out animation to complete before calling onFinish
      setTimeout(() => {
        onFinish();
      }, 500);
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`splash-screen-simple ${!isVisible ? "fade-out" : ""}`}>
      <div className="flex items-center justify-center h-full">
        <Image
          src="/logo/logo-with-name.svg"
          alt="Adaptivin Logo"
          width={320}
          height={240}
          className="splash-logo-simple"
          priority
        />
      </div>
    </div>
  );
};

export default SplashScreen;
