"use client";

import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { ClassThemeProvider } from '@/contexts/ClassThemeContext';

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
