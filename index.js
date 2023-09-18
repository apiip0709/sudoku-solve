document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 9;
    const solveButton = document.getElementById("solve-btn");
    solveButton.addEventListener('click', solveSudoku);

    const sudokuGrid = document.getElementById("sudoku-grid");
    // Buat column dan baris sudoku dan mengubah jadi inputan
    for(let row = 0; row < gridSize; row++){
        const newRow = document.createElement("tr");
        for(let col = 0; col < gridSize; col++){
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
})

async function solveSudoku(){
    const gridSize = 9;
    const sudokuArray = [];

    // Mengisi setiap kotak dengan nilai dari grid
    for(let row = 0; row < gridSize; row++){
        sudokuArray[row] = [];
        for(let col = 0; col < gridSize; col++){
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
        }
    }

    // mengidentifikasi input dari user baris dan menandai
    for(let row = 0; row < gridSize; row++){
        for(let col = 0; col < gridSize; col++){
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            if(sudokuArray[row][col] !== 0){
                cell.classList.add("user-input")
            }
        }
    }

    // Menyelesaikan sudoku dan memberikan hasilnya
    if(solveSudokuHelper(sudokuArray)){
        for(let row = 0; row < gridSize; row++){
            for(let col = 0; col < gridSize; col++){
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                // Menyimpan hasil nilai dan memberikan animasi ke dalam kotak
                if(!cell.classList.contains("user-input")){
                    cell.value = sudokuArray[row][col];
                    cell.classList.add("solved");
                    await sleep(20); // delay untuk visualnya
                }
            }
        }
    }else{
        alert("Tidak Ada Solusi untuk Selesaikan Sudoku");
    }
}

function solveSudokuHelper(board){
    const gridSize = 9;
    
    for(let row = 0; row < gridSize; row++){
        for(let col = 0; col < gridSize; col++){
            if(board[row][col] === 0){
                for(let num = 1; num <= 9; num++){
                    if(isValidMove(board, row, col, num)){
                        board[row][col] = num;

                        // mencoba secara rekursif untuk selesaikan sudoku
                        if(solveSudokuHelper(board)){
                            return true; // puzzle solved
                        }

                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }

    return true; // seluruh kotak terpenuhi
}

function isValidMove(board, row, col, num){
    const gridSize = 9;

    // cek kesamaan dari baris dan kolom
    for(let i = 0; i < gridSize; i++){
        if(board[row][i] === num || board[i][col] === num){
            return false; // kesamaan ditemukan
        }
    }

    // cek kesamaan dari kotak 3*3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for(let i = startRow; i < startRow + 3; i++){
        for(let j = startCol; j < startCol + 3; j++){
            if(board[i][j] === num){
                return false; // menemukan kesamaan
            }
        }
    }

    return true; // tidak ada kesamaan
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}