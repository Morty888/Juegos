import { useState, useEffect } from 'react';
import CheckersPiece from './CheckersPiece';
import { isValidMove, getAllPossibleMoves, executeMove, isGameOver, countPieces } from '../utils/checkersRules';
import { getRandomValidMove } from '../utils/checkersAI';

const initialBoard = [
  [null, 'p', null, 'p', null, 'p', null, 'p'],
  ['p', null, 'p', null, 'p', null, 'p', null],
  [null, 'p', null, 'p', null, 'p', null, 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', null, 'P', null, 'P', null, 'P', null],
  [null, 'P', null, 'P', null, 'P', null, 'P'],
  ['P', null, 'P', null, 'P', null, 'P', null],
];

const CheckersBoard = ({ currentPlayer, onTurnChange, setGameStatus }) => {
  console.log('CheckersBoard renderizando...');
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  
  console.log('Board state:', board);

  const movePiece = (move) => {
    const newBoard = executeMove(board, move);
    setBoard(newBoard);
    setSelectedPiece(null);
    setPossibleMoves([]);
    onTurnChange();
  };

  const handleSquareClick = (x, y) => {
    // Prevent interaction during black's turn
    if (currentPlayer === 'black') {
      return;
    }

    if (selectedPiece) {
      // Check if this is a valid move
      const validMove = possibleMoves.find(move => 
        move.to.x === x && move.to.y === y
      );
      
      if (validMove) {
        movePiece(validMove);
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else {
      const piece = board[y][x];
      // Only allow selecting white pieces (player controlled)
      if (piece && piece === piece.toUpperCase()) {
        setSelectedPiece({ x, y });
        
        // Get all possible moves for this piece
        const allMoves = getAllPossibleMoves(board, currentPlayer);
        const pieceMoves = allMoves.filter(move => 
          move.from.x === x && move.from.y === y
        );
        setPossibleMoves(pieceMoves);
      }
    }
  };

  // AI movement for black pieces
  useEffect(() => {
    if (currentPlayer === 'black') {
      const timer = setTimeout(() => {
        const aiMove = getRandomValidMove(board, 'black');
        if (aiMove) {
          movePiece(aiMove);
        }
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board]);

  // Check for game over
  useEffect(() => {
    if (isGameOver(board, currentPlayer)) {
      setGameStatus(`${currentPlayer === 'white' ? 'Black' : 'White'} wins! No moves available.`);
    } else {
      const { whitePieces, blackPieces } = countPieces(board);
      if (whitePieces === 0) {
        setGameStatus('Black wins! All white pieces captured.');
      } else if (blackPieces === 0) {
        setGameStatus('White wins! All black pieces captured.');
      } else {
        setGameStatus('ongoing');
      }
    }
  }, [board, currentPlayer, setGameStatus]);

  const isValidMoveSquare = (x, y) => {
    return possibleMoves.some(move => move.to.x === x && move.to.y === y);
  };

  console.log('Rendering board...');
  
  return (
    <div className="grid grid-cols-8 gap-0 w-[512px] h-[512px] border-4 border-white rounded-lg overflow-hidden" style={{ boxShadow: '0 0 10px white, 0 0 20px white' }}>
      {board.map((row, y) =>
        row.map((piece, x) => (
          <div
            key={`${x}-${y}`}
            className={`w-16 h-16 flex items-center justify-center ${
              (x + y) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800'
            } ${selectedPiece && selectedPiece.x === x && selectedPiece.y === y ? 'bg-blue-300' : ''} ${
              isValidMoveSquare(x, y) ? 'bg-green-300' : ''
            } ${
              currentPlayer === 'black' ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={() => handleSquareClick(x, y)}
          >
            {piece && <CheckersPiece piece={piece} />}
          </div>
        ))
      )}
    </div>
  );
};

export default CheckersBoard;