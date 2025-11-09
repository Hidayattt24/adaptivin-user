"use client";

import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface TimelineStep {
  label: string;
  status: "completed" | "active" | "pending";
}

interface UploadTimelineProps {
  steps: TimelineStep[];
}

export function UploadTimeline({ steps }: UploadTimelineProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-center gap-6">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <div className="flex flex-col items-center gap-3">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 shadow-md ${
                  step.status === "completed"
                    ? "bg-green-500 text-white"
                    : step.status === "active"
                    ? "bg-[#336d82] text-white ring-4 ring-[#336d82]/20"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step.status === "completed" ? (
                  <CheckCircleIcon sx={{ fontSize: 32 }} />
                ) : (
                  <span className="text-xl font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-base font-semibold transition-colors duration-300 ${
                  step.status === "active" || step.status === "completed"
                    ? "text-[#336d82]"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-1.5 w-32 rounded-full transition-all duration-300 ${
                  step.status === "completed" ? "bg-green-500" : "bg-gray-300"
                }`}
                style={{ marginTop: "-40px" }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
