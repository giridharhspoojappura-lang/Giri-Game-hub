const canvas =
document.getElementById("gameCanvas");

const snakeImg = new Image();
snakeImg.src = "assets/snake.png";

const appleImg = new Image();
appleImg.src = "assets/apple.png";

let started = false;
const ctx =
canvas.getContext("2d");

const scoreDisplay =
document.getElementById("score");

const bestDisplay =
document.getElementById("best");

const restartBtn =
document.getElementById("restartBtn");

const eatSound =
new Audio("assets/eat.mp3");

const loseSound =
new Audio("assets/lose.mp3");

const box = 20;
let touchStartX = 0;
let touchStartY = 0;


let best =
localStorage.getItem("snakeBest")
|| 0;

bestDisplay.innerText = best;

let snake;
let food;
let direction;
let score;
let game;

function startGame(){

        ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    snake = [
        {x:200,y:200}
    ];

    food = {
        x:
        Math.floor(
        Math.random()*20
        )*box,

        y:
        Math.floor(
        Math.random()*20
        )*box
    };

    direction = null;
started = false;;

    score = 0;

    scoreDisplay.innerText = 0;

    clearInterval(game);

    game =
    setInterval(draw,100);
}

startGame();

document.addEventListener(
"keydown",
changeDirection
);
canvas.addEventListener(
    "touchstart",
    handleTouchStart
);

canvas.addEventListener(
    "touchend",
    handleTouchEnd
);

function changeDirection(e){
    started = true;
    if(
    (e.key==="ArrowUp" ||
     e.key==="w") &&
     direction!=="DOWN"
    ){
        direction="UP";
    }

    if(
    (e.key==="ArrowDown" ||
     e.key==="s") &&
     direction!=="UP"
    ){
        direction="DOWN";
    }

    if(
    (e.key==="ArrowLeft" ||
     e.key==="a") &&
     direction!=="RIGHT"
    ){
        direction="LEFT";
    }

    if(
    (e.key==="ArrowRight" ||
     e.key==="d") &&
     direction!=="LEFT"
    ){
        direction="RIGHT";
    }
}


function handleTouchStart(e){

    touchStartX =
        e.changedTouches[0].screenX;

    touchStartY =
        e.changedTouches[0].screenY;
}

function handleTouchEnd(e){

    let touchEndX =
        e.changedTouches[0].screenX;

    let touchEndY =
        e.changedTouches[0].screenY;

    let dx =
        touchEndX - touchStartX;

    let dy =
        touchEndY - touchStartY;

    started = true;

    if(
        Math.abs(dx) >
        Math.abs(dy)
    ){

        if(
            dx > 0 &&
            direction !== "LEFT"
        ){
            direction = "RIGHT";
        }

        else if(
            dx < 0 &&
            direction !== "RIGHT"
        ){
            direction = "LEFT";
        }

    }else{

        if(
            dy > 0 &&
            direction !== "UP"
        ){
            direction = "DOWN";
        }

        else if(
            dy < 0 &&
            direction !== "DOWN"
        ){
            direction = "UP";
        }
    }
}





function collision(head,array){

    for(let i=0;i<array.length;i++){

        if(
        head.x===array[i].x &&
        head.y===array[i].y
        ){
            return true;
        }
    }

    return false;
}

function draw(){

    ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
);

if(!started){

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "Press Any Key",
        canvas.width/2,
        canvas.height/2
    );

    ctx.fillText(
        "or Swipe To Start",
        canvas.width/2,
        canvas.height/2 + 40
    );

    return;
}

    ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
    );

    snake.forEach((part, index) => {

    if(index === 0){

        // HEAD IMAGE
        ctx.drawImage(
            snakeImg,
            part.x,
            part.y,
            box,
            box
        );

    }else{

        // BODY SEGMENT
        ctx.fillStyle = "#00ff88";

        ctx.fillRect(
            part.x + 2,
            part.y + 2,
            box - 4,
            box - 4
        );

        // Neon glow
        ctx.shadowColor = "#00ff88";
        ctx.shadowBlur = 10;

        ctx.fillRect(
            part.x + 2,
            part.y + 2,
            box - 4,
            box - 4
        );

        ctx.shadowBlur = 0;
    }

});

    ctx.drawImage(
    appleImg,
    food.x,
    food.y,
    box,
    box
);
    if(!started){
    return;
}
    let headX =
    snake[0].x;

    let headY =
    snake[0].y;

    if(direction==="UP")
        headY -= box;

    if(direction==="DOWN")
        headY += box;

    if(direction==="LEFT")
        headX -= box;

    if(direction==="RIGHT")
        headX += box;

    if(
    headX===food.x &&
    headY===food.y
    ){

        score++;

        eatSound.currentTime=0;
        eatSound.play();

        scoreDisplay.innerText =
        score;

        if(score > best){

            best = score;

            localStorage.setItem(
            "snakeBest",
            best
            );

            bestDisplay.innerText =
            best;
        }

        food = {

            x:
            Math.floor(
            Math.random()*20
            )*box,

            y:
            Math.floor(
            Math.random()*20
            )*box
        };

    }else{

        snake.pop();
    }

    const newHead = {

        x:headX,
        y:headY
    };

    if(

    headX < 0 ||

    headY < 0 ||

    headX >= canvas.width ||

    headY >= canvas.height ||

    collision(
    newHead,
    snake
    )

    ){

        loseSound.currentTime=0;
        loseSound.play();

        clearInterval(game);

        setTimeout(()=>{

            alert(
            "💀 Game Over\nScore: "
            + score
            );

        },100);

        return;
    }

    snake.unshift(
    newHead
    );
}

restartBtn.addEventListener("click", () => {

    loseSound.pause();
    loseSound.currentTime = 0;

    eatSound.pause();
    eatSound.currentTime = 0;

    startGame();

});


async function shareScore(){

    const tempCanvas =
    document.createElement("canvas");

    tempCanvas.width = 800;
    tempCanvas.height = 800;

    const tctx =
    tempCanvas.getContext("2d");

    // Background
    tctx.fillStyle = "#12003d";
    tctx.fillRect(
        0,
        0,
        800,
        800
    );

    // Title
    tctx.fillStyle = "#00ffff";
    tctx.font = "bold 50px Arial";
    tctx.textAlign = "center";

    tctx.fillText(
        "🎮 Giri's Game Hub",
        400,
        80
    );

    tctx.fillStyle = "white";
    tctx.font = "40px Arial";

    tctx.fillText(
        "🐍 Snake",
        400,
        150
    );

   tctx.fillText(
    "🏆 SCORE : " + score,
    400,
    220
);

tctx.fillText(
    "⭐ BEST : " + best,
    400,
    280
);
   

tctx.strokeRect(
    40,
    210,
    720,
    560
);
    // Screenshot
    tctx.drawImage(
    canvas,
    25,
    220,
    750,
    550
);



tctx.fillStyle = "#00ffff";

tctx.font = "24px Arial";

tctx.fillText(
    "girigamehub.netlify.app",
    400,
    790
);

    const dataUrl =
    tempCanvas.toDataURL("image/png");

    // Mobile Share
    try{

        const blob =
        await (
            await fetch(dataUrl)
        ).blob();

        const file =
        new File(
            [blob],
            "snake-score.png",
            {
                type:"image/png"
            }
        );

        if(
            navigator.canShare &&
            navigator.canShare({
                files:[file]
            })
        ){

            await navigator.share({
    title:"Giri's Game Hub",
    text:
    "🐍 I scored " +
    score +
    " points in Snake!\n\n" +
    "🔥 Can you beat me?\n\n" +
    "🎮 Play here:\n" +
    "https://girighub.netlify.app/games/snake/",
    files:[file]
});

            return;
        }

    }catch(err){
        console.log(err);
    }

    // Fallback Download
    const link =
    document.createElement("a");

    link.download =
    "snake-score.png";

    link.href =
    dataUrl;

    link.click();
}

shareBtn.addEventListener("click", () => {
    console.log("Share button clicked");
    shareScore();
});