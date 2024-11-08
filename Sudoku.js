// script.js

const puzzle = Array.from({ length: 9 }, () => Array(9).fill(0)); // Empty board for user input
let board = JSON.parse(JSON.stringify(puzzle)); // Clone of the puzzle for modifications

// Initialize the Sudoku board
function initBoard() {
  const boardElement = document.getElementById("sudoku-board");
  boardElement.innerHTML = "";
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.contentEditable = "true";
      cell.oninput = () => validateInput(cell, row, col);
      boardElement.appendChild(cell);
    }
  }
}

// Validate input and populate the board array
function validateInput(cell, row, col) {
  const value = parseInt(cell.innerText);
  if (isNaN(value) || value < 1 || value > 9) {
    cell.innerText = ""; // Clear invalid input
    showFeedback("Please enter a number between 1 and 9.");
    board[row][col] = 0;
  } else {
    board[row][col] = value;
    showFeedback("");
  }
}

// Backtracking algorithm to solve the puzzle
function solvePuzzle() {
  if (solveSudoku(board)) {
    updateBoard();
    showFeedback("Puzzle solved!");
  } else {
    showFeedback("No solution exists for this puzzle.");
  }
}

// Recursive function to solve Sudoku using backtracking
function solveSudoku(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0; // Backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Check if it's safe to place a number in a cell
function isSafe(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num || 
        grid[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] === num) {
      return false;
    }
  }
  return true;
}

// Update the board visually after solving
function updateBoard() {
  const cells = document.querySelectorAll(".cell");
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const index = row * 9 + col;
      cells[index].innerText = board[row][col];
      cells[index].style.backgroundColor = "#e0f7fa"; // Color solved cells
    }
  }
}

// Provide a hint
function getHint() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] === 0 && board[row][col] === 0) {
        const hint = getPossibleValues(row, col)[0];
        if (hint) {
          const cell = document.querySelectorAll(".cell")[row * 9 + col];
          cell.innerText = hint;
          board[row][col] = hint;
          showFeedback(`Hint: Try ${hint} at Row ${row + 1}, Col ${col + 1}`);
          return;
        }
      }
    }
  }
  showFeedback("No hints available.");
}

// Find possible values for a cell
function getPossibleValues(row, col) {
  const values = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (let i = 0; i < 9; i++) {
    values.delete(board[row][i]);
    values.delete(board[i][col]);
    values.delete(board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3]);
  }
  return Array.from(values);
}

// Show feedback to the user
function showFeedback(message) {
  document.getElementById("feedback").innerText = message;
}

// Reset the board for user input
function resetBoard() {
  board = JSON.parse(JSON.stringify(puzzle));
  initBoard();
  showFeedback("Board reset. Try solving it!");
}

// Initialize the board on load
window.onload = initBoard;
