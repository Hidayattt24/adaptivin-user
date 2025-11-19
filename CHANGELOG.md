# Changelog - Bug Fixes & Feature Implementations

## Summary
This changelog documents all bug fixes and new features implemented based on black-box testing results.

## Bug Fixes

### 1. ✅ Fixed Character Selection Page Desktop Button Bug
**Files:** 
- `src/app/(platform)/siswa/pilih-karakter/page.tsx`
- `src/components/siswa/carousel/InfiniteCarousel.tsx`

**Main Button Fix:**
- Added proper async/await handling for character selection
- Added button disabled state when no character is centered
- Added error handling with try-catch
- Improved button type attribute

**Navigation Button Fix (Tombol Selanjutnya/Sebelumnya):**
- Fixed race condition between scroll handler and button navigation
- Added `isNavigatingRef` flag to prevent scroll handler from overriding button navigation
- Modified `scrollToCard` to accept `isButtonNavigation` parameter
- Now immediately updates `activeIndex` when button is clicked
- Prevents scroll event listener from interfering during button navigation
- Card now centers perfectly on first click of "Selanjutnya" button

**Card Positioning Accuracy Fix:**
- Fixed card centering calculation to match CSS gap values exactly
  - Mobile: gap-5 (20px)
  - Small: gap-6 (24px)  
  - Medium: gap-7 (28px)
  - Large: gap-8 (32px)
- Improved scroll position calculation to account for first card's left margin
- Updated both `scrollToCard` and `handleScroll` functions with accurate positioning logic
- Cards now scroll to exact center position matching their `activeIndex`
- No more "off-by-one" card positioning issues

### 2. ✅ Fixed Password Change Alert Issue
**Files:** 
- `src/app/(platform)/siswa/profil/ganti-password/page.tsx`
- `src/lib/api/user.ts`

**Root Cause:**
- Backend successfully changed password but returned `data: null` or `data: {}`
- Frontend's `extractData()` function threw "No data returned from API" error
- This caused frontend to show error alert despite successful password change

**Fixes:**
- **API Layer (`user.ts`):**
  - Updated `updateMyPassword()` to pass `allowNull=true` to `extractData()`
  - This allows null/empty data response since password update doesn't need to return data
  - Added type annotation `Record<string, unknown> | null` for proper typing
  
- **UI Layer (`ganti-password/page.tsx`):**
  - Fixed alert showing "failed" even when password was successfully changed
  - Added proper `await` for Swal.fire to prevent race conditions
  - Enhanced error message extraction with better HTTP status code handling:
    - 401: "Password lama tidak sesuai"
    - 400: "Data tidak valid"
    - 500+: "Server sedang bermasalah"
  - Added special handling for "No data returned from API" error
  - Added form clearing after successful password change
  - Added `showConfirmButton: false` for auto-close success message

### 3. ✅ Added "Sudah Dipelajari" Label for Completed Materials
**Files:**
- `src/components/siswa/materi/MateriCard.tsx` - Added completion badge UI
- `src/app/(platform)/siswa/materi/[classId]/page.tsx` - Added completion status fetching
- `src/lib/api/kuis.ts` - Added `checkMateriCompletion()` and `getMateriCompletionStatus()` functions

**Features:**
- Green badge with checkmark appears on materials where student has completed the quiz
- Badge positioned at top-right corner of material card
- Async fetching of completion status for each material

## New Features

### 4. ✅ Material Count in Teacher's Class Card
**Files:**
- `src/components/guru/kelas/ClassCard.tsx` - Added material count badge
- `src/hooks/guru/useClasses.ts` - Added material count fetching
- `src/app/(platform)/guru/dashboard/page.tsx` - Pass material count to ClassCard

**Features:**
- Displays material count with 📚 emoji in class card
- Badge shows next to "Aktif" badge
- Automatically fetches material count for each class

### 5. ✅ Search Feature in Question Management
**Files:** 
- `src/app/(platform)/guru/kelas/[kelasId]/soal/page.tsx` - Main soal list page with search (terluar)
- `src/app/(platform)/guru/kelas/[kelasId]/soal/bank/page.tsx` - Bank soal page (no search)

**Implementation:**
- Added search functionality to main question list page (halaman terluar)
- Search filter with `useMemo` for efficient real-time filtering
- Automatically resets to page 1 when searching
- Searches through:
  - Question text (`soal_teks`)
  - Answer text (`jawaban.isi_jawaban`)
  - Explanation text (`penjelasan`)
  - Question level (`level_soal`)

**UI/UX Features:**
- Responsive search bar with search icon and clear (×) button
- Shows "Menampilkan X hasil dari Y soal untuk 'query'" when searching
- Empty state for no search results with "Hapus Pencarian" button
- Real-time filtering as user types
- Mobile-optimized with proper padding and touch-friendly buttons
- Pagination works with filtered results

### 6. ✅ Student Completion Count in Quiz Management
**Files:**
- `src/lib/api/kuis.ts` - Added `getKuisCompletionCount()` function
- `src/components/guru/kuis/KuisCard.tsx` - Display completion statistics

**Implementation:**
- Fixed API endpoint: Uses `GET /api/hasil-kuis?kuis_id={kuisId}` instead of non-existent stats endpoint
- Fetches all `hasil_kuis_siswa` records for the quiz
- Calculates statistics from `selesai` field:
  - `completed`: Count where `selesai = true`
  - `inProgress`: Count where `selesai = false`
  - `total`: Total count of all hasil kuis records

**UI Features:**
- Shows total students who have worked on the quiz
- Breaks down into "selesai" (completed) and "progress" (in progress)
- Visual indicators:
  - ✓ Green checkmark icon for completed
  - 🟡 Yellow dot for in progress
- Stats displayed in quiz card info section with People icon
- Auto-fetches on component mount

### 7. ✅ Confirmation Dialog When Deleting Quiz with Results
**File:** `src/components/guru/kuis/KuisCard.tsx`

**Implementation:**
- Checks `completionStats.total` before allowing deletion
- Two-stage confirmation system:
  1. **With Results:** Shows detailed warning about cascade deletion
  2. **No Results:** Simple confirmation dialog

**Cascade Deletion Handling:**
- Backend uses `ON DELETE CASCADE` on foreign key relationship
- When quiz is deleted, all `hasil_kuis_siswa` records are automatically deleted
- Frontend shows clear warning before deletion

**Alert Content (When Results Exist):**
- Total number of students who worked on quiz
- Breakdown: X selesai, Y sedang mengerjakan
- ⚠️ Red warning: "Jika kuis dihapus, semua hasil kuis siswa akan ikut terhapus!"
- Strong confirmation button: "Ya, saya mengerti. Hapus!"
- Option to cancel

**Error Handling:**
- Try-catch around deletion
- Success message: "Kuis berhasil dihapus!" (auto-close 2s)
- Error message shows specific error details
- Graceful fallback when stats unavailable

### 8. ✅ User-Friendly Error Handling System
**New Files:**
- `src/components/common/ErrorBoundary.tsx` - Global error boundary component
- `src/utils/errorHandler.ts` - Error handling utilities

**Updated Files:**
- `src/components/providers/Providers.tsx` - Wrapped app with ErrorBoundary

**Features:**
- Global ErrorBoundary catches all React errors
- User-friendly error messages (no technical jargon)
- Retry and Go Back buttons
- Auto-refresh option
- Only shows detailed errors in development
- Clean error UI with helpful icons
- Utility functions for consistent error handling:
  - `showErrorAlert()` - Show error with retry option
  - `showSuccessAlert()` - Show success message
  - `handleApiError()` - Handle API errors
  - `withErrorHandling()` - Wrapper for async operations

### 9. ✅ 30-Minute Idle Timeout Session Management
**File:** `src/contexts/AuthContext.tsx`

**Implementation:**
- Tracks user activity with `lastActivity` timestamp
- Checks for inactivity every 1 minute
- Only triggers if NO activity for 30 minutes (not during active use)

**Activity Detection:**
User activity detected on:
- Mouse clicks (`mousedown`)
- Keyboard input (`keydown`)
- Scrolling (`scroll`)
- Touch events (`touchstart`)
- Any click events (`click`)

**Two-Stage Warning System:**
1. **Early Warning (25 minutes):**
   - Toast notification: "Sesi Akan Berakhir"
   - Shows 5 minutes before actual timeout
   - Non-blocking, appears at top-right corner
   - Auto-dismisses after 5 seconds
   - Gives user chance to stay logged in with any activity

2. **Session Expired (30 minutes):**
   - Modal dialog: "Sesi Berakhir"
   - Cannot be dismissed (non-closable)
   - Shows clear message about 30-minute inactivity
   - Redirects to `/login` after confirmation
   - Clears all user data and React Query cache

**Smart Timer Reset:**
- Timer automatically resets on ANY user activity
- Warning flag resets when user becomes active again
- Prevents logout during active usage
- Only counts TRUE idle time (no mouse/keyboard/scroll activity)

**Cross-Tab Synchronization:**
- Activity in one tab keeps ALL tabs alive
- Uses localStorage with key `adaptivin_last_activity` for sync
- Storage event listener propagates activity to other tabs
- Benefits:
  - User actively working in Tab 1 (kelola soal)
  - Opens Tab 2 (lihat laporan) → stays logged in automatically
  - No need to re-login in multiple tabs
  - Seamless multi-tab experience
- Automatic cleanup on logout/session expired

### 10. ✅ Protected Route Middleware with Smart Redirect
**Files:**
- `middleware.ts` - Route protection and redirect logic
- `src/app/(auth)/login/siswa/page.tsx` - Siswa login with redirect handling (wrapped in Suspense)
- `src/app/(auth)/login/guru/page.tsx` - Guru login with redirect handling (wrapped in Suspense)

**How It Works:**
1. **User tries to access protected route without login:**
   - Example: User types `/guru/dashboard` or `/siswa/beranda` in URL
   - Middleware detects no authentication token
   - Redirects to appropriate login page based on route:
     - `/siswa/*` routes → `/login/siswa?redirect=/siswa/beranda`
     - `/guru/*` routes → `/login/guru?redirect=/guru/dashboard`

2. **After successful login:**
   - Login page reads `redirect` query parameter
   - If parameter exists and matches role:
     - Guru: Redirects to intended guru route
     - Siswa: Redirects to intended siswa route
   - If no parameter or invalid:
     - Guru: Default to `/guru/dashboard`
     - Siswa: Default to `/siswa/onboarding`

**Security Features:**
- ✅ Role-based path validation (siswa can't access guru routes)
- ✅ Token-based authentication check
- ✅ Prevents unauthorized access to protected pages
- ✅ Automatic redirect to login with return URL
- ✅ Protection against direct URL manipulation

**User Experience:**
- User bookmarks a deep link → Login → Goes directly to bookmarked page
- Seamless flow when session expires
- No need to navigate again after login
- Smart detection based on intended route

**Protected Routes:**
- All `/guru/*` routes (dashboard, kelas, soal, materi, kuis, etc.)
- All `/siswa/*` routes (beranda, materi, profil, kuis, etc.)

**Technical Implementation:**
- `useSearchParams()` wrapped in `<Suspense>` boundary (Next.js 15 requirement)
- Separate `LoginFormWithRedirect` component for dynamic params handling
- Loading fallback during Suspense phase
- Fixes build error: "useSearchParams() should be wrapped in a suspense boundary"

## Code Quality Improvements

### Error Handling
- All error messages are now user-friendly in Indonesian
- Console logs only in development mode
- No technical error details shown to users in production
- Consistent error handling across all components

### User Experience
- Loading states for all async operations
- Clear visual feedback for all actions
- Helpful messages and instructions
- Graceful degradation when features fail
- Retry mechanisms where appropriate

### Security
- Session timeout prevents unauthorized access
- Automatic cleanup of sensitive data
- Secure token refresh mechanism
- No security vulnerabilities in session management

## Testing Recommendations

1. **Character Selection**: Test on desktop with mouse and keyboard
2. **Password Change**: Test with correct and incorrect old passwords
3. **Material Completion**: Complete a quiz and verify badge appears
4. **Material Count**: Verify count updates when materials are added/removed
5. **Search**: Test with various search terms in question bank
6. **Quiz Deletion**: Test deleting quiz with and without student results
7. **Error Handling**: Force errors to verify error boundary and messages
8. **Session Timeout**: Wait 30 minutes inactive and verify auto-logout

## Notes

- All changes maintain existing functionality
- Backward compatible with current database schema
- Mobile responsive design maintained
- Performance optimized with proper memoization
- TypeScript types properly defined for all new features

