/**
 * AI Loader Component
 *
 * Kid-friendly loading animation while AI analyzes quiz results
 * Features:
 * - Animated robot icon
 * - Bouncing dots
 * - Colorful gradient background
 * - Engaging text for kids
 */

export default function AILoader() {
  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #336D82 0%, #7AB0C4 100%)",
      }}
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float-delay-1" />
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-white/10 rounded-full animate-float-delay-2" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Robot Icon with Animation */}
        <div className="relative mb-8">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 w-[120px] h-[120px] rounded-full bg-white/20 animate-ping" />

          {/* Robot Container */}
          <div className="relative w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
            <span className="material-symbols-outlined text-[#336D82] text-[64px]">
              smart_toy
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-[20px] font-bold mb-3 text-center">
          Mbah AdaptivAI
        </h2>

        {/* Loading Text */}
        <p className="text-white text-[14px] font-medium mb-6 text-center">
          Sedang menganalisis hasil belajarmu...
        </p>

        {/* Animated Dots */}
        <div className="flex gap-2 mb-8">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce-delay-1" />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce-delay-2" />
        </div>

        {/* Fun Message */}
        <div className="bg-white/20 backdrop-blur-sm rounded-[20px] px-6 py-4 max-w-[300px]">
          <p className="text-white text-[12px] text-center leading-relaxed">
            Sabar ya! Mbah AdaptivAI sedang menyiapkan analisis yang menarik
            untukmu! 🎓✨
          </p>
        </div>
      </div>

      {/* Add Google Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
    </div>
  );
}
