const CheckersPiece = ({ piece }) => {
  const isKing = piece.toLowerCase() === 'k';
  const isWhite = piece === piece.toUpperCase();
  
  return (
    <div className={`
      w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-lg
      ${isWhite 
        ? 'bg-red-500 border-red-700 text-white shadow-lg' 
        : 'bg-gray-800 border-black text-white shadow-lg'
      }
      ${isKing ? 'border-yellow-400' : ''}
      transition-all duration-200 hover:scale-110
    `}>
      {isKing && '♔'}
    </div>
  );
};

export default CheckersPiece;