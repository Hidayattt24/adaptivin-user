import dynamic from "next/dynamic";
import { ChartSkeleton } from "./skeletons/ChartSkeleton";

// Lazy load PerformanceChart with code-splitting
// This separates the heavy recharts library into its own bundle
export const PerformanceChartLazy = dynamic(
  () => import("./PerformanceChart"),
  {
    loading: () => <ChartSkeleton />,
    ssr: false, // Disable SSR for this component as charts don't need server rendering
  }
);
