window.addEventListener("keyup", StartPlayingEnter);
window.addEventListener("keydown", DinoJumpShift);
document.body.addEventListener("click", DinoJumpClick);
let container = document.getElementById("game");
let dino = document.getElementById("dino-png");
dino.src = "images/dino.png";
let playBtn = document.getElementById("playBtn");
let showBorder = document.getElementById("turnBorder");
showBorder.onclick = TurnBorder;
let border = "none";
playBtn.onclick = StartPlayingClick;

let dinoTop = "0%";
let cactusTop = "0%";
let cactusWidth = "0%";
let cactusHeight = "0%";
let animationTime = 3.0;
let dinoJumpTime;

let checkWindow = setInterval(() => {
    if(window.innerWidth < window.innerHeight) {
        playBtn.style.width = "20%";
        playBtn.style.height = "8%";
        dino.style.width = "10%";
        dino.style.height = "6%";
        dino.style.top = "-6%";
        cactusWidth = "5%";
        cactusHeight = "5%";

        dinoJumpTime = 2.0;
        
        container.style.margin = " 40% 20% 0 0"
    }
    else {
        playBtn.style.width = "8%";
        playBtn.style.height = "5%";
        dino.style.width = "6%";
        dino.style.height = "8%";
        dino.style.top = "-8%";
        container.style.margin = " 20% 10% 0 20%"
        cactusWidth = "3%";
        cactusHeight = "5%";

        dinoJumpTime = 1.0;

    }
}, 500);

dino.style.border = border;
let gameIsInProcess = false;
let dinoInAir = false;
let cactusImages = ["images/cactus_0.png","images/cactus_1.png","images/cactus_2.png", "images/cactus_0.png", "images/flying_1.png"];
let score = 0;
let scorepoints = document.getElementById("scorepoints");
scorepoints.textContent = score;

let animateDinoInterval;

function StartPlayingClick() {
    if(gameIsInProcess)
        return;
    if (!gameIsInProcess) {
        gameIsInProcess = true;
        playBtn.style.visibility ="hidden";
        playBtn.disabled = true;
        if(gameIsInProcess) {
            CactusSpawnProcess();
            AnimateDino();
        }
    }
}

function StartPlayingEnter(e) {
    if (e.keyCode === 13) {
        if(!gameIsInProcess)
            StartPlayingClick();
    }
}

function DinoJump() {
    dino.classList.add("dinoIsJumping");
    dino.style.animationDuration = dinoJumpTime * animationTime * 333 + "ms";
    dinoInAir = true;
    clearInterval(animateDinoInterval);
    setTimeout(() => {
        if(dinoInAir != false) {
            dino.classList.remove("dinoIsJumping");
            dinoInAir = false;
            AnimateDino();
        }
    }, dinoJumpTime * animationTime * 333);
}

function DinoJumpClick() {
    if(dinoInAir != true && gameIsInProcess == true) {
        DinoJump();
    }
}

function DinoJumpShift(e) {
    if(e.keyCode === 16 && gameIsInProcess == true) {
        DinoJump();
    }
}

function AnimateDino() {
    console.log(dino.src);
    let f = true;
    animateDinoInterval = setInterval(() => {
        if(f) {
            dino.src = "images/dino.png";
            f = false;
        }
        else if (!f) {
            dino.src = "images/dino_2.png"
            f = true;
        }
        if (!gameIsInProcess)
            clearInterval(animateDinoInterval);
    }, animationTime * 50);

}

function CactusSpawnProcess() {
        let intervalId = setInterval(() => {
            if(gameIsInProcess) {
                score += 10;
                scorepoints.textContent = score;
            }
            else if (!gameIsInProcess) {
                scorepoints.textContent = score;
                clearInterval(intervalId);
            }
        }, animationTime * 150);
        let intervalId1 = setInterval(() => {
            if (gameIsInProcess) {
                let i = 0;
                SpawnCactus(i);
                console.log(document.getElementById("existingCactus" + i).classList);
                DetectCactusCollision("existingCactus" + i);
                DeleteCactus("existingCactus" + i, animationTime * 800);
                i++;
            }
            if (!gameIsInProcess)
                clearInterval(intervalId1);
        }, animationTime * 800 + 100);

        let intervalId0 = setInterval(() => {
            if(animationTime >= 1.0)
                animationTime = animationTime - 0.1;
            else if (animationTime < 1.0)
                clearInterval(intervalId0);
            else if (!gameIsInProcess)
                clearInterval(intervalId0);
        }, 10000);
}

function DeleteCactus(cactusId, delay) {
    setTimeout(() => {
        let currentCactus;
        if((currentCactus = document.getElementById(cactusId)) != null)
            currentCactus.remove();
    }, delay);
}

function DetectCactusCollision(cactusId) {

    let cactus = document.getElementById(cactusId);
    if(cactus == null)
        return;
    console.log(cactus.y + " " + dino.y);

    let checkCollision = setInterval(() => {
        if(!gameIsInProcess) {
            cactus.remove();
                score = 0;
                animationTime = 3.0;
                playBtn.style.visibility ="visible";
                playBtn.disabled = false;
                clearInterval(checkCollision);
        }
        console.log("gamestatus: " + gameIsInProcess);
        console.log("cactus: " + cactus.y);
        console.log("dino: " + dino.y);

        if (DetectCollision(dino,cactus))
            gameIsInProcess = false;

    }, animationTime * 33);
}

function DetectCollision(dino,object){
    var XColl=false;
    var YColl=false;
  
    if ((dino.x + dino.width >= object.x) && (dino.x <= object.x + object.width)) XColl = true;
    if ((dino.y + dino.height >= object.y) && (dino.y <= object.y + object.height)) YColl = true;
  
    if (XColl&YColl)
        return true;
    return false;
  }

function SpawnCactus(count) {
    let existingCactus = document.createElement("img");
    let cactusImage = cactusImages[RandomImgSrc(1,4)];
    if (cactusImage === cactusImages[4]) {
        existingCactus.style.top = "-15%";
        existingCactus.style.width = cactusHeight * 1.5;
        existingCactus.style.height = cactusWidth;

        let flyingAnimate = setInterval(() => {
            if(existingCactus === null)
                clearInterval(flyingAnimate);
            if(cactusImage === "images/flying_1.png")
                cactusImage = "images/flying_2.png";
            else if (cactusImage === "images/flying_2.png")
                cactusImage = "images/flying_1.png";
            existingCactus.src = cactusImage;
        }, animationTime * 33);
    }
    else {
        existingCactus.style.top = "-5%";
        existingCactus.style.width = cactusWidth;
        existingCactus.style.height = cactusHeight;
        existingCactus.src = cactusImage;
    }


    existingCactus.style.display = "block";
    existingCactus.style.margin = "0";
    existingCactus.style.position = "absolute";
    existingCactus.style.right = "0";

    existingCactus.style.border = border;
    existingCactus.id = "existingCactus" + count;

    existingCactus.classList.add("cactusIsAnimated");
    existingCactus.style.animation = "cactusAnimation "+ animationTime * 800 + "ms linear";

    console.log("id: " + existingCactus.id);

    let game = document.getElementById("game");
    game.appendChild(existingCactus);
}

function RandomImgSrc(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function TurnBorder() {
    if(border == "none") {
        border = "dashed red 2px";
        dino.style.border = border;
    } 
    else {
        border = "none";
        dino.style.border = border;
    }

}

