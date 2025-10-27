"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

const KelasOverviewPage = () => {
  const params = useParams();
  const router = useRouter();
  const kelasId = params.kelasId;

  // Auto redirect to materi page
  React.useEffect(() => {
    router.push(`/guru/kelas/${kelasId}/materi`);
  }, [kelasId, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#336d82] mx-auto mb-4"></div>
        <p className="text-[#336d82] poppins-medium">Mengalihkan...</p>
      </div>
    </div>
  );
};

export default KelasOverviewPage;
