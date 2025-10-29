import dynamic from "next/dynamic";
import { CardSkeleton } from "@/components/guru";

// Lazy load MateriProgressCard with code-splitting
export const MateriProgressCardLazy = dynamic(
  () => import("./MateriProgressCard"),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
);
