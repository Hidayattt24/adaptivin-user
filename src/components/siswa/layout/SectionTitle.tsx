interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTitle({
  children,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`px-6 py-6 ${className}`}>
      <h2 className="text-[16px] font-bold text-[#33A1E0] text-center drop-shadow-sm">
        {children}
      </h2>
    </div>
  );
}
