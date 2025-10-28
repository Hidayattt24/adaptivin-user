import dynamic from "next/dynamic";
import { CardSkeleton } from "./skeletons/CardSkeleton";

// Lazy load MateriProgressCard with code-splitting
export const MateriProgressCardLazy = dynamic(
  () => import("./MateriProgressCard"),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
);
