const isValidMove = (board, startPos, endPos, currentPlayer, forcedCaptures = []) => {
  const piece = board[startPos.y][startPos.x];
  const targetPiece = board[endPos.y][endPos.x];

  // Check if the move is within the board
  if (endPos.x < 0 || endPos.x > 7 || endPos.y < 0 || endPos.y > 7) {
    return false;
  }

  // Check if there's actually a piece at the start position
  if (!piece) {
    return false;
  }

  // Check if the player is moving their own piece
  if (currentPlayer === 'white' && piece !== piece.toUpperCase()) {
    return false;
  }
  if (currentPlayer === 'black' && piece !== piece.toLowerCase()) {
    return false;
  }

  // Check if the target square is empty
  if (targetPiece) {
    return false;
  }

  // Must move diagonally
  const dx = Math.abs(endPos.x - startPos.x);
  const dy = Math.abs(endPos.y - startPos.y);
  
  if (dx !== dy) {
    return false;
  }

  // If there are forced captures, only capture moves are allowed
  if (forcedCaptures.length > 0) {
    const moveIsCapture = dx === 2 && dy === 2;
    if (!moveIsCapture) {
      return false;
    }
  }

  // Check for capture move (jump over enemy piece)
  if (dx === 2 && dy === 2) {
    const middleX = startPos.x + (endPos.x - startPos.x) / 2;
    const middleY = startPos.y + (endPos.y - startPos.y) / 2;
    const middlePiece = board[middleY][middleX];
    
    // Must jump over an enemy piece
    if (!middlePiece) {
      return false;
    }
    
    // Check if it's an enemy piece
    if (currentPlayer === 'white' && middlePiece === middlePiece.toUpperCase()) {
      return false;
    }
    if (currentPlayer === 'black' && middlePiece === middlePiece.toLowerCase()) {
      return false;
    }
    
    return true;
  }

  // Regular move (one square diagonal)
  if (dx === 1 && dy === 1) {
    const isKing = piece.toLowerCase() === 'k';
    
    if (!isKing) {
      // Regular pieces can only move forward
      if (currentPlayer === 'white' && endPos.y >= startPos.y) {
        return false;
      }
      if (currentPlayer === 'black' && endPos.y <= startPos.y) {
        return false;
      }
    }
    
    return true;
  }

  return false;
};

const getAllPossibleMoves = (board, currentPlayer) => {
  const moves = [];
  const captures = [];
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && (
        (currentPlayer === 'white' && piece === piece.toUpperCase()) ||
        (currentPlayer === 'black' && piece === piece.toLowerCase())
      )) {
        // Check all diagonal directions
        const directions = [
          [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];
        
        for (const [dx, dy] of directions) {
          // Check regular move
          const newX = x + dx;
          const newY = y + dy;
          if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
            if (isValidMove(board, { x, y }, { x: newX, y: newY }, currentPlayer)) {
              moves.push({
                from: { x, y },
                to: { x: newX, y: newY },
                isCapture: false
              });
            }
          }
          
          // Check capture move
          const captureX = x + dx * 2;
          const captureY = y + dy * 2;
          if (captureX >= 0 && captureX < 8 && captureY >= 0 && captureY < 8) {
            if (isValidMove(board, { x, y }, { x: captureX, y: captureY }, currentPlayer)) {
              captures.push({
                from: { x, y },
                to: { x: captureX, y: captureY },
                isCapture: true,
                capturedPiece: { x: x + dx, y: y + dy }
              });
            }
          }
        }
      }
    }
  }
  
  // If captures are available, only return captures (forced capture rule)
  return captures.length > 0 ? captures : moves;
};

const executeMove = (board, move) => {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[move.from.y][move.from.x];
  
  // Move the piece
  newBoard[move.to.y][move.to.x] = piece;
  newBoard[move.from.y][move.from.x] = null;
  
  // Remove captured piece if it's a capture
  if (move.isCapture && move.capturedPiece) {
    newBoard[move.capturedPiece.y][move.capturedPiece.x] = null;
  }
  
  // Promote to king if reached the end
  const isWhite = piece === piece.toUpperCase();
  const isBlack = piece === piece.toLowerCase();
  
  if (isWhite && move.to.y === 0 && piece.toLowerCase() !== 'k') {
    newBoard[move.to.y][move.to.x] = 'K';
  } else if (isBlack && move.to.y === 7 && piece.toLowerCase() !== 'k') {
    newBoard[move.to.y][move.to.x] = 'k';
  }
  
  return newBoard;
};

const isGameOver = (board, currentPlayer) => {
  const possibleMoves = getAllPossibleMoves(board, currentPlayer);
  return possibleMoves.length === 0;
};

const countPieces = (board) => {
  let whitePieces = 0;
  let blackPieces = 0;
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece) {
        if (piece === piece.toUpperCase()) {
          whitePieces++;
        } else {
          blackPieces++;
        }
      }
    }
  }
  
  return { whitePieces, blackPieces };
};

export { isValidMove, getAllPossibleMoves, executeMove, isGameOver, countPieces };