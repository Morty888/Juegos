
const GameInfo = ({ currentPlayer, gameStatus }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-white w-full" style={{ boxShadow: '0 0 10px white, 0 0 20px white' }}>
      <h2 className="text-2xl font-bold mb-4 text-white">Damas Info</h2>
      <p className="mb-2 text-foreground">
        Turno Actual: <span className="font-semibold capitalize text-white">{currentPlayer === 'white' ? 'Rojo' : 'Negro'}</span>
      </p>
      <p className="mb-2 text-foreground">
        Estado del Juego: <span className="font-semibold capitalize text-white">{gameStatus === 'ongoing' ? 'En curso' : gameStatus}</span>
      </p>
      <div className="mb-4 text-foreground">
        <h3 className="text-lg font-semibold text-white mb-2">Reglas:</h3>
        <ul className="text-sm space-y-1">
          <li>• Mueve solo en diagonal</li>
          <li>• Salta sobre piezas enemigas para capturar</li>
          <li>• Llega al final para coronar (♔)</li>
          <li>• Controlas las piezas rojas</li>
        </ul>
      </div>
      {gameStatus !== 'ongoing' && (
        <button
          className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-300"
          onClick={() => window.location.reload()}
        >
          Nuevo Juego
        </button>
      )}
    </div>
  );
};

export default GameInfo;
