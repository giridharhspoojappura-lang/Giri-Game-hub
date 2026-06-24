const cells =
document.querySelectorAll(".cell");


const difficultySelect =
document.getElementById("difficulty");

const statusText =
document.getElementById("status");

const winsDisplay =
document.getElementById("wins");

const bestDisplay =
document.getElementById("best");

const restartBtn =
document.getElementById("restartBtn");

const shareBtn =
document.getElementById("shareBtn");

const moveSound =
new Audio("assets/move.mp3");

const playerWinSound =
new Audio("assets/playerwin.mp3");

const aiWinSound =
new Audio("assets/aiwin.mp3");

const drawSound =
new Audio("assets/draw.mp3");

let board =
["","","","","","","","",""];

let gameOver = false;

let wins =
0;

let best =
localStorage.getItem("tttBest")
|| 0;

bestDisplay.innerText =
best;

const combos = [

[0,1,2],
[3,4,5],
[6,7,8],

[0,3,6],
[1,4,7],
[2,5,8],

[0,4,8],
[2,4,6]

];

function checkWinner(b){

for(let combo of combos){

const[a,b1,c] =
combo;

if(
b[a] &&
b[a]===b[b1] &&
b[a]===b[c]
){
return b[a];
}
}

if(
!b.includes("")
){
return "draw";
}

return null;
}

function minimax(
board,
depth,
isMax
){

const result =
checkWinner(board);

if(result==="O")
return 10-depth;

if(result==="X")
return depth-10;

if(result==="draw")
return 0;

if(isMax){

let bestScore =
-Infinity;

for(
let i=0;
i<9;
i++
){

if(board[i]===""){

board[i]="O";

bestScore =
Math.max(
bestScore,
minimax(
board,
depth+1,
false
)
);

board[i]="";
}
}

return bestScore;
}

let bestScore =
Infinity;

for(
let i=0;
i<9;
i++
){

if(board[i]===""){

board[i]="X";

bestScore =
Math.min(
bestScore,
minimax(
board,
depth+1,
true
)
);

board[i]="";
}
}

return bestScore;
}

function aiMove(){

    if(gameOver)
    return;

    statusText.innerText =
    "AI Thinking...";

    setTimeout(()=>{

        let move;

        const difficulty =
        difficultySelect.value;

        let smartChance;

        if(difficulty === "easy"){

            smartChance = 0.2;

        }else if(
            difficulty === "medium"
        ){

            smartChance = 0.6;

        }else{

            smartChance = 0.9;
        }

        if(
            Math.random() >
            smartChance
        ){

            let empty = [];

            for(
                let i=0;
                i<9;
                i++
            ){

                if(
                    board[i] === ""
                ){
                    empty.push(i);
                }
            }

            move =
            empty[
                Math.floor(
                    Math.random() *
                    empty.length
                )
            ];

        }else{

            let bestScore =
            -Infinity;

            for(
                let i=0;
                i<9;
                i++
            ){

                if(board[i] === ""){

                    board[i] = "O";

                    let score =
                    minimax(
                        board,
                        0,
                        false
                    );

                    board[i] = "";

                    if(
                        score >
                        bestScore
                    ){

                        bestScore =
                        score;

                        move = i;
                    }
                }
            }
        }

        board[move] = "O";
        moveSound.currentTime = 0;
moveSound.play();

        render();

        const result =
        checkWinner(board);

        if(result){

            endGame(result);

        }else{

            statusText.innerText =
            "Your Turn (X)";
        }

    },400);
}

function endGame(result){

gameOver = true;

if(result==="X"){
playerWinSound.currentTime = 0;
    playerWinSound.play();
wins++;

winsDisplay.innerText =
wins;

if(wins > best){

best = wins;

localStorage.setItem(
"tttBest",
best
);

bestDisplay.innerText =
best;
}

statusText.innerText =
"🎉 You Beat AI";

}else if(
result==="O"
){
aiWinSound.currentTime = 0;
    aiWinSound.play();
statusText.innerText =
"🤖 AI Wins";

}else{
drawSound.currentTime = 0;
    drawSound.play();
statusText.innerText =
"🤝 Draw";
}
}

function render(){

cells.forEach(
(cell,index)=>{

cell.innerText =
board[index];

cell.className =
"cell";

if(
board[index]==="X"
){
cell.classList.add("x");
}

if(
board[index]==="O"
){
cell.classList.add("o");
}

});
}

cells.forEach(cell=>{

cell.addEventListener(
"click",
()=>{

const index =
cell.dataset.index;

if(
board[index]!=="" ||
gameOver
){
return;
}

board[index]="X";
moveSound.currentTime = 0;
moveSound.play();
render();

const result =
checkWinner(board);

if(result){

endGame(result);

return;
}

aiMove();
});
});

restartBtn.addEventListener(
"click",
()=>{

    stopAllSounds();

    board =
    ["","","","","","","","",""];

    gameOver =
    false;

    statusText.innerText =
    "Your Turn (X)";

    render();
}
);

async function shareResult(){

    const tempCanvas =
    document.createElement("canvas");

    tempCanvas.width = 800;
    tempCanvas.height = 900;

    const tctx =
    tempCanvas.getContext("2d");

    // Background
    tctx.fillStyle = "#12003d";
    tctx.fillRect(
        0,
        0,
        800,
        900
    );

    // Title
    tctx.fillStyle = "#00ffff";
    tctx.textAlign = "center";

    tctx.font = "bold 50px Arial";

    tctx.fillText(
        "🎮 Giri's Game Hub",
        400,
        70
    );

    tctx.fillStyle = "white";
    tctx.font = "40px Arial";

    tctx.fillText(
        "🎯 Tic Tac Toe AI",
        400,
        130
    );

    tctx.fillText(
        "🏆 Wins : " + wins,
        400,
        200
    );

    tctx.fillText(
        "⭐ Best : " + best,
        400,
        260
    );

    tctx.fillStyle = "#00ffff";
    tctx.font = "32px Arial";

    tctx.fillText(
        statusText.innerText,
        400,
        330
    );

    // Board border
    tctx.strokeStyle = "#ff00ff";
    tctx.lineWidth = 4;

    tctx.strokeRect(
        170,
        380,
        460,
        460
    );

    // Draw grid
    tctx.strokeStyle = "#ff00ff";
    tctx.lineWidth = 6;

    // Vertical
    tctx.beginPath();
    tctx.moveTo(323,380);
    tctx.lineTo(323,840);
    tctx.stroke();

    tctx.beginPath();
    tctx.moveTo(477,380);
    tctx.lineTo(477,840);
    tctx.stroke();

    // Horizontal
    tctx.beginPath();
    tctx.moveTo(170,533);
    tctx.lineTo(630,533);
    tctx.stroke();

    tctx.beginPath();
    tctx.moveTo(170,686);
    tctx.lineTo(630,686);
    tctx.stroke();

    // Draw X and O
    board.forEach((value,index)=>{

        const row =
        Math.floor(index / 3);

        const col =
        index % 3;

        const x =
        247 + col * 154;

        const y =
        475 + row * 154;

        if(value === "X"){

            tctx.fillStyle =
            "#00ffff";

            tctx.font =
            "bold 80px Arial";

            tctx.fillText(
                "X",
                x,
                y
            );
        }

        if(value === "O"){

            tctx.fillStyle =
            "#ff66ff";

            tctx.font =
            "bold 80px Arial";

            tctx.fillText(
                "O",
                x,
                y
            );
        }

    });

    // Footer
    tctx.fillStyle =
    "#00ffff";

    tctx.font =
    "24px Arial";

    tctx.fillText(
        "🔥 Can you beat the AI?",
        400,
        870
    );

    const dataUrl =
    tempCanvas.toDataURL("image/png");

    try{

        const blob =
        await (
            await fetch(dataUrl)
        ).blob();

        const file =
        new File(
            [blob],
            "tictactoe-score.png",
            {
                type:"image/png"
            }
        );

        if(
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({
                files:[file]
            })
        ){

            await navigator.share({

                title:
                "Giri's Game Hub",

                text:
                "🎯 I challenged the AI in Tic Tac Toe!\n\n" +
                "🤖 Can you beat it?\n\n" +
                "🎮 Play here:\n" +
                "https://girighub.netlify.app/games/tictactoe/",

                files:[file]
            });

            return;
        }

    }catch(err){

        console.log(err);
    }

    // PC fallback
    const link =
    document.createElement("a");

    link.download =
    "tictactoe-score.png";

    link.href =
    dataUrl;

    link.click();
}

shareBtn.addEventListener(
    "click",
    shareResult
);

render();

function stopAllSounds(){

    [
        moveSound,
        playerWinSound,
        aiWinSound,
        drawSound
    ].forEach(sound=>{

        sound.pause();
        sound.currentTime = 0;

    });
}

