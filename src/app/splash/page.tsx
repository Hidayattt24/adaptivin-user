"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";

const SplashPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear any existing splash cookie to ensure splash always shows
    // Remove this line in production if you want persistent splash tracking
    document.cookie =
      "hasSeenSplash=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const handleSplashFinish = () => {
    // Set cookie to indicate user has seen splash
    document.cookie = "hasSeenSplash=true; path=/; max-age=86400"; // 24 hours

    // Redirect to pick role page
    router.push("/pick-role");
  };

  return <SplashScreen onFinish={handleSplashFinish} />;
};

export default SplashPage;
