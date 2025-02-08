interface ChittyAvatarProps {
  isResponding?: boolean;
}

export const ChittyAvatar = ({ isResponding = false }: ChittyAvatarProps) => {
  return (
    <div className={`relative w-10 h-10 ${isResponding ? 'animate-pulse' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
          <span className="text-white text-lg font-bold">C</span>
        </div>
      </div>
    </div>
  );
};
