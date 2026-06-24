const board =
document.getElementById("board");

const flipSound =
new Audio("assets/flip.mp3");

const matchSound =
new Audio("assets/match.mp3");

const goldenSound =
new Audio("assets/golden.mp3");

const winSound =
new Audio("assets/win.mp3");

const movesDisplay =
document.getElementById("moves");

const timerDisplay =
document.getElementById("timer");

const bestDisplay =
document.getElementById("best");

const statusText =
document.getElementById("status");
let goldenUsed = false;
const restartBtn =
document.getElementById("restartBtn");

let lockBoard = false;

const emojis = [

"🚀","🚀",
"🐍","🐍",
"🎮","🎮",
"🔥","🔥",
"⚡","⚡",
"👾","👾",
"💎","💎",
"🎯","🎯",
"🏆","🏆",
"🧠","🧠",
"🎵","🎵",
"🚗","🚗",

"⭐"
];

let cards = [];

let flipped = [];

let matchedPairs = 0;

let moves = 0;

let timer = 0;

let interval;

let best =
localStorage.getItem(
"memoryBest"
);

bestDisplay.innerText =
best
? best + "s"
: "--";

function shuffle(array){

for(
let i=array.length-1;
i>0;
i--
){

const j =
Math.floor(
Math.random()*(i+1)
);

[array[i],array[j]] =
[array[j],array[i]];
}

return array;
}

function startGame(){
    goldenUsed = false;

    board.innerHTML = "";

    cards = shuffle([...emojis]);

    flipped = [];

    matchedPairs = 0;

    moves = 0;

    timer = 0;

    movesDisplay.innerText = 0;

    timerDisplay.innerText = 0;

    statusText.innerText = "";

    clearInterval(interval);

    // CREATE CARDS
    cards.forEach((card,index)=>{

        const div =
        document.createElement("div");

        div.className = "card";

        div.dataset.value = card;

        div.innerText = card; // show emoji initially

        board.appendChild(div);

    });

    // SHOW FOR 3 SECONDS
    statusText.innerText =
    "🧠 Memorize the cards!";

    setTimeout(()=>{

        document
        .querySelectorAll(".card")
        .forEach(card=>{

            card.innerText = "?";

            card.addEventListener(
                "click",
                flipCard
            );

        });

        statusText.innerText = "";

        // START TIMER AFTER REVEAL
        interval =
        setInterval(()=>{

            timer++;

            timerDisplay.innerText =
            timer;

        },1000);

    },3000);
}

function flipCard(){

    if(lockBoard)
    return;

    if(
    this.classList.contains("matched") ||
    this.classList.contains("flipped")
    ) return;

    const value =
    this.dataset.value;

    this.classList.add(
    "flipped"
    );

    this.innerText =
    value;

    // ⭐ Golden Card
    if(value==="⭐"){

        if(goldenUsed)
        return;

        goldenUsed = true;

        goldenSound.currentTime = 0;
        goldenSound.play();

        this.classList.add(
        "golden"
        );

        this.style.opacity =
        "0.5";

        this.style.cursor =
        "not-allowed";

        revealAll();

        return;
    }

    // Normal cards only
    flipSound.currentTime = 0;
    flipSound.play();

    flipped.push(this);

    if(
    flipped.length===2
    ){

        moves++;

        movesDisplay.innerText =
        moves;

        checkMatch();
    }
}

function revealAll(){
lockBoard = true;
    const allCards =
    document.querySelectorAll(".card");

    allCards.forEach(card=>{

        card.innerText =
        card.dataset.value;

        card.classList.add(
            "flipped"
        );

    });

    statusText.innerText =
    "⭐ Golden Card Activated!";

    setTimeout(()=>{

        allCards.forEach(card=>{

            if(
                !card.classList.contains(
                    "matched"
                ) &&
                card.dataset.value !== "⭐"
            ){

                card.innerText = "?";

                card.classList.remove(
                    "flipped"
                );
            }

        });

        statusText.innerText = "";
        lockBoard = false;
    },5000); // 5 seconds
}

function checkMatch(){

const[a,b] =
flipped;

if(
a.dataset.value===
b.dataset.value
){
matchSound.currentTime = 0;
    matchSound.play();
a.classList.add(
"matched"
);

b.classList.add(
"matched"
);

matchedPairs++;

flipped=[];

if(matchedPairs === 12){
    winSound.currentTime = 0;
    winSound.play();
    clearInterval(interval);

    statusText.innerText =
    "🎉 Memory Master!";

    let best =
    localStorage.getItem(
    "memoryBest"
    );

    if(
        !best ||
        timer < Number(best)
    ){

        localStorage.setItem(
        "memoryBest",
        timer
        );

        bestDisplay.innerText =
        timer + "s";
    }
}
}
else{

lockBoard = true;

setTimeout(()=>{

    a.innerText="?";
    b.innerText="?";

    a.classList.remove("flipped");
    b.classList.remove("flipped");

    flipped=[];

    lockBoard = false;

},800);
}
}

restartBtn.addEventListener(
"click",
()=>{

    stopAllSounds();

    startGame();

});

bestDisplay.innerText =
best;

startGame();

async function shareResult(){

    const tempCanvas =
    document.createElement("canvas");

    tempCanvas.width = 800;
    tempCanvas.height = 850;

    const tctx =
    tempCanvas.getContext("2d");

    // Background
    tctx.fillStyle = "#12003d";
    tctx.fillRect(
        0,
        0,
        800,
        850
    );

    // Title
    tctx.fillStyle = "#00ffff";
    tctx.textAlign = "center";

    tctx.font =
    "bold 50px Arial";

    tctx.fillText(
        "🎮 Giri's Game Hub",
        400,
        80
    );

    tctx.fillStyle =
    "white";

    tctx.font =
    "40px Arial";

    tctx.fillText(
        "🧠 Memory Match",
        400,
        150
    );

    tctx.fillText(
        "⏱ Time : " + timer + "s",
        400,
        230
    );

    tctx.fillText(
        "🎯 Moves : " + moves,
        400,
        290
    );

    tctx.fillStyle =
    "#00ff88";

    tctx.font =
    "bold 90px Arial";

    tctx.fillText(
        "Memory Master",
        400,
        470
    );

    tctx.fillStyle =
    "#ffffff";

    tctx.font =
    "36px Arial";

    tctx.fillText(
        "Can you beat me?",
        400,
        620
    );

    tctx.fillStyle =
    "#00ffff";

    tctx.font =
    "24px Arial";

    tctx.fillText(
        "https://girighub.netlify.app/games/memory-match/",
        400,
        780
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
            "memory-match.png",
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

                title:
                "Memory Match",

                text:
                "🧠 I completed Memory Match in " +
                timer +
                " seconds with " +
                moves +
                " moves!\n\n" +
                "🔥 Can you beat me?\n\n" +
                "🎮 Play here:\n" +
                "https://girighub.netlify.app/games/memory-match/",

                files:[file]
            });

            return;
        }

    }catch(err){

        console.log(err);
    }

    const link =
    document.createElement("a");

    link.download =
    "memory-match.png";

    link.href =
    dataUrl;

    link.click();
}

shareBtn.addEventListener(
    "click",
    shareResult
);

function stopAllSounds(){

    [
        flipSound,
        matchSound,
        goldenSound,
        winSound
    ].forEach(sound=>{

        sound.pause();
        sound.currentTime = 0;

    });
}