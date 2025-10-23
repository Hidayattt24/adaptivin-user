export default function MobileWarning() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl text-center">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-[#336d82]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#336d82] mb-4">
          Maaf, saat ini pengembangan lagi dalam mobile
        </h1>
        <p className="text-lg text-gray-600">
          Silakan akses aplikasi ini melalui perangkat mobile untuk pengalaman
          terbaik.
        </p>
      </div>
    </div>
  );
}
