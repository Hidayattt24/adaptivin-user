import Image from "next/image";

interface HeaderProps {
  username: string;
  profileImage?: string;
}

export default function Header({
  username,
  profileImage = "/siswa/foto-profil/kocheng-oren.svg",
}: HeaderProps) {
  return (
    <div className="px-6 pt-[71px] pb-6">
      <div className="flex items-start justify-between">
        {/* Greeting */}
        <div className="flex-1">
          <h1 className="text-[26px] font-bold text-[#2B7A9E] leading-tight drop-shadow-sm font-poppins">
            Hallo {username}
          </h1>
          <p className="text-[19px] font-medium text-[#2B7A9E] mt-1 font-poppins">
            siap belajar seru hari ini?
          </p>
        </div>

        {/* Profile Picture - Clean design without background circles */}
        <div className="relative flex-shrink-0 ml-4">
          <div className="w-[75px] h-[75px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_20px_0_rgba(43,122,158,0.2)] overflow-hidden border-2 border-[#33A1E0]/30">
            <Image
              src={profileImage}
              alt={`${username} Profile`}
              width={70}
              height={70}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
