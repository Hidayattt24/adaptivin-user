"use client";

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { ClassThemeProvider } from '@/contexts/ClassThemeContext';

/**
 * Class-based Materi Layout
 *
 * Wraps all routes under /siswa/materi/[classId] with ClassThemeProvider
 * Automatically applies theme based on classId from URL
 *
 * Routes covered:
 * - /siswa/materi/4 (list)
 * - /siswa/materi/4/pecahan-biasa-campuran-4 (detail)
 * - /siswa/materi/4/pecahan-biasa-campuran-4/kuis (kuis)
 * etc.
 */

export default function MateriClassLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const classId = params?.classId as string;

  // Validate classId (must be '4', '5', or '6')
  const validClassId = ['4', '5', '6'].includes(classId) ? classId : '4';

  return (
    <ClassThemeProvider classId={validClassId}>
      {children}
    </ClassThemeProvider>
  );
}
