import { getAllPossibleMoves, executeMove } from './checkersRules';

// Simple AI that prioritizes captures and makes smart moves
export const getRandomValidMove = (board, player) => {
  console.log(`AI is looking for moves for ${player}`);
  
  const allMoves = getAllPossibleMoves(board, player);
  
  if (allMoves.length === 0) {
    console.log(`No valid moves found for ${player}`);
    return null;
  }
  
  // Prioritize captures
  const captures = allMoves.filter(move => move.isCapture);
  const regularMoves = allMoves.filter(move => !move.isCapture);
  
  let selectedMove;
  
  if (captures.length > 0) {
    // Always prefer captures
    selectedMove = captures[Math.floor(Math.random() * captures.length)];
    console.log(`AI selected capture move:`, selectedMove);
  } else {
    // Simple strategy for regular moves:
    // 1. Try to advance pieces toward promotion
    // 2. Keep pieces safe from captures
    
    // Prefer moves that advance pieces
    const advancingMoves = regularMoves.filter(move => {
      if (player === 'black') {
        return move.to.y > move.from.y; // Moving down the board
      } else {
        return move.to.y < move.from.y; // Moving up the board
      }
    });
    
    if (advancingMoves.length > 0) {
      selectedMove = advancingMoves[Math.floor(Math.random() * advancingMoves.length)];
    } else {
      selectedMove = regularMoves[Math.floor(Math.random() * regularMoves.length)];
    }
    
    console.log(`AI selected regular move:`, selectedMove);
  }
  
  return selectedMove;
};
