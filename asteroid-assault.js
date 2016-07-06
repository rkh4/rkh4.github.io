//Initialisation of global variables
document.getElementById('game').style.cursor = "none";
var crosshairX = 100;
var crosshairY = 100;
var game;
var menuState = true;
var menu;
var Level = 01;
var Health = 100;
var Score = 01;
var tempScore = 0;
var damage = 1;
var spawnRate = 50;
var spawnCount = spawnRate -10; 
var fireRate = 5;
var fireCount = 0;
var soundFile = 1;
var soundOn = true;
/*var gunMp3 = document.getElementById("gunSound");
var gunMp4 = gunMp3.cloneNode(true);
var gunMp5 = gunMp3.cloneNode(true);
var gunMp6 = gunMp3.cloneNode(true);
var gunMp7 = gunMp3.cloneNode(true);
var themeTune = document.getElementById("themeTune");*/
var newHighscore = false;

//Holds enemy objects
var enemies = [];
enemies.length = 0;
var bullets = [];
bullets.length = 0;
var mothershipObj = new mothership();

//High scores
if (JSON.parse(localStorage["highscoresRKH4"] == null)) {
    console.log("null");
    var highscoresRKH4 = [];
    highscoresRKH4[0] = 0;
    highscoresRKH4[1] = 0;
    highscoresRKH4[2] = 0;
    highscoresRKH4[3] = 0;
    highscoresRKH4[4] = 0;
} else {
    var highscoresRKH4 = JSON.parse(localStorage["highscoresRKH4"]);
}

//High score object
function highScore(name,score){
    this.name = name
    this.score = score;
}


//Enemy object
function enemy(x,y,speed){
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 25;
    this.speed = speed;
}

//bullet object
function bullet(x,y,mouseX,mouseY){
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 25;
    var xDistance = mouseX - x;
    var yDistance = mouseY - y;
    var distanceTotal = Math.sqrt(xDistance * xDistance + 
            yDistance * yDistance);
    this.xDistance = xDistance / distanceTotal;
    this.yDistance = yDistance / distanceTotal;
    this.speed = 25;
}

//Mothership object
function mothership(){
    this.x = 620;
    this.y = 280;
    this.height = 50;
    this.width = 50;
}


//Set up canvas & canvas context
var canv = document.getElementById("game");
var ctx = canv.getContext("2d");

//Motion listener
canv.addEventListener("mousemove",mousemotion,false);
function mousemotion(m){
    var bounding_box = canv.getBoundingClientRect();
    crosshairX = (m.clientX - bounding_box.left) * 
                (canv.width/bounding_box.width);
    crosshairY = (m.clientY - bounding_box.top) * 
                (canv.height/bounding_box.height);
}

canv.addEventListener("mousedown",fire,false);
function fire(e){
    //If Not in a menu, can create bullet
    if (!menuState && (soundOn == true)){
        //Switch used, so multiple sound files can be played
        /*switch(soundFile){
            case 1:
                gunMp3.play();
                soundFile++;
                break;
            case 2:
                gunMp4.play();
                soundFile++;
                break;
            case 3:
                gunMp5.play();
                soundFile++;
                break;
            case 4: 
                gunMp6.play();
                soundFile++;
                break;
            case 5:
                gunMp7.play();
                soundFile = 1;
                break;
        }*/
        var tempBullet = new bullet(605, 295, crosshairX,crosshairY);
        bullets.push(tempBullet);
    } else if (!menuState && soundOn == false){
        var tempBullet = new bullet(605, 295, crosshairX,crosshairY);
        bullets.push(tempBullet);
    }
}

//Keyboard listener, variable holds keys currently down
var keysDown = {};

addEventListener("keydown",function(e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup",function(e) {
    delete keysDown[e.keyCode];
}, false);

//add other mouse events here

//---------------------------------------------------------------
//-------------------------INITIALISATION------------------------
//---------------------------------------------------------------
function init() {

    //themeTune.play();

    //Load background
    var bgLoaded = false;
    backgroundImg = new Image();
    backgroundImg.src = 'img/background.png';
    backgroundImg.onload = function() {
        bgloaded = true;
    }

    //Load mothership
    mothershipImg = new Image();
    mothershipImg.src = 'img/mothership.png';
    mothershipImg.onload = function() {
        ctx.drawImage(mothershipImg,500, 250);
    }

    //Load cannon image


    //Loads crosshair image
    crosshairImg = new Image();
    crosshairImg.src = 'img/crosshair.png';
    crosshairImg.onload = function() {
        ctx.drawImage(crosshairImg,-100,-100);
    }

    //Loads asteroid image
    asteroidImg = new Image();
    asteroidImg.src = 'img/asteroid.png';
    asteroidImg.onload = function() {
        ctx.drawImage(asteroidImg,-150,-100);
    }

    //Loads bullet image
    bulletImg = new Image();
    bulletImg.src = 'img/bullet.png';
    bulletImg.onload = function() {
        bulletImg.height = (bulletImg.height/2);
        bulletImg.width = (bulletImg.width/2);
        ctx.drawImage(bulletImg,-200,-100);
    }

    //Load logo
    logoImg = new Image();
    logoImg.src = 'img/logo.png';
    logoImg.onload = function() {
        draw(logoImg,-100,-100);
    }

    clearInterval(menu);
    menu = setInterval(start_menu,50);
}

//----------------------------------------------------------------
//-------------------------START----------------------------------
//----------------------------------------------------------------
function start_game() {
    //Calls the game_loop function every 50ms
    clearInterval(game);
    game = setInterval(game_loop, 50);
}

function start_menu(){
    console.log("start menu");
    draw(backgroundImg,0,0);

    draw(logoImg,160,0);

    //Start game text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "80px Calibri";
    ctx.fillText("Start Game",400, 190);

    //White border for box
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(490,205,200,100);
    //Play box, black
    ctx.fillStyle = '#000000';
    ctx.fillRect(495,210,190,90);
    //Play button text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText("PLAY",560,265);

    //controls
    //movement text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText("Use mouse (or w,a,s,d in game) to move the crosshair",100,400);
    draw(crosshairImg,800,380);
    //shoot
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText("Shoot the asteroids with leftClick or spacebar",100,440);
    draw(asteroidImg,690,415);
    //Sound
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText("Press m to turn off the music",100,480);
    //Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText("Have fun!",100,520);


    draw(crosshairImg,crosshairX,crosshairY);
    canv.addEventListener("mousedown",checkPosition,false);
}

function checkPosition(e){
    //Checks
    if ((crosshairX < 690) && (crosshairX > 490) 
            && (crosshairY < 305) && (crosshairY > 205)){
        clearInterval(menu);
        menuState = false;
        start_game();
    }
}

function pauseGame() {
    console.log("Game paused");
}

//----------------------------------------------------------------
//-----------------------GAME LOOP--------------------------------
//----------------------------------------------------------------
function game_loop(){
    //Clears the canvas
    canv.width=canv.width;
    draw(backgroundImg,0,0);

    /*if (!soundOn) {
        themeTune.pause();
    } else {
        themeTune.play();
    }*/

    //Used to increase levels
    if (tempScore > 200) {
        Level++;
        spawnRate = spawnRate * 0.8;
        tempScore = 0;
        if (fireRate > 1) {
            fireRate -= 0.5;
        }
    }

    damage = Level;

    //Check end game
    if (Health > 0){
        Score ++;
        tempScore++;
        spawn_enemy();
        draw(mothershipImg,470,150);
        draw(crosshairImg,crosshairX,crosshairY);

        //Collision detection with mothership
        var enemyLength = enemies.length;
        for (var i = 0; i < enemies.length; i++){
            if (collision_detection(enemies[i],mothershipObj)){
                enemies.splice(i,1);
                Health-=damage;	
            }
            update_enemy_position(i);
            draw(asteroidImg,enemies[i].x,enemies[i].y);
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.font = "20px Calibri";
        if (soundOn){
            ctx.fillText("(M)usic On",10,20);
        }
        else {
            ctx.fillText("(M)usic Off",10,20);
        }


        //Check if spacebar pressed
        if (32 in keysDown) {
            fireCount++;
            if (fireCount > fireRate){
                if (soundOn==true) {
                    var tempBullet = new bullet(605, 295, 
                                    crosshairX,crosshairY);
                    bullets.push(tempBullet);
                    /*switch(soundFile){
                        case 1:
                            gunMp3.play();
                            soundFile++;
                            break;
                        case 2:
                            gunMp4.play();
                            soundFile++;
                            break;
                        case 3:
                            gunMp5.play();
                            soundFile++;
                            break;
                        case 4: 
                            gunMp6.play();
                            soundFile++;
                            break;
                        case 5:
                            gunMp7.play();
                            soundFile = 1;
                            break;
                    }*/
                } else {
                    var tempBullet = new bullet(605, 295, 
                                    crosshairX,crosshairY);
                    bullets.push(tempBullet);
                }
                fireCount = 0;
            }					
        }

        //key a (left) pressed
        if (65 in keysDown) {
            console.log("left");
            crosshairX -= 20;
        }
        //Key d (right) pressed
        if (68 in keysDown){
            console.log("right");
            crosshairX += 20;
        }
        //Key w (up) pressed
        if (87 in keysDown){
            console.log("up");
            crosshairY -= 20;
        }
        //Key s (down) pressed
        if (83 in keysDown){
            console.log("down");
            crosshairY += 20;
        }

        //Key m down (music)
        if (77 in keysDown){
            if (soundOn){
                soundOn = false;
                setTimeout(function(){},2000);
            } else {
                soundOn = true;
                setTimeout(function(){},2000);
            }
        }


        //Collision detection, bullets & enemies
        var bulletsLength = bullets.length;
        for (var j = 0; j < bullets.length; j++){
            for (var i = 0; i <enemies.length; i++){
                if (collision_detection(bullets[j],enemies[i])){
                    enemies.splice(i,1);
                    bullets.splice(j,1);
                }
            }
            update_bullet_pos(j);
            draw(bulletImg,bullets[j].x, bullets[j].y);
        }

        //Heads up display
        HUD();
    } else {
        //If health reaches 0, end game
        menuState = true;
        draw(crosshairImg,crosshairX,crosshairY);
        clearInterval(game);
        //check high scores
        for (i =0; i < highscoresRKH4.length; i++){
            if (Score > highscoresRKH4[i]) {
                newHighscore = true;
            }
            else newHighscore = false;
        }
        highscoresRKH4.push(Score);
        highscoresRKH4.sort(function(a,b){return a-b});
        localStorage["highscoresRKH4"] = JSON.stringify(highscoresRKH4);

        clearInterval(menu);
        menu = setInterval(end_game,50);
    }
}

//----------------------------------------------------------------
//-----------------------END GAME---------------------------------
//----------------------------------------------------------------
function end_game(){
    draw(backgroundImg,0,0);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "80px Calibri";
    ctx.fillText("Game Over",400, 180);

    ctx.font = "30px Calibri";
    ctx.fillText("You scored: ",500, 220);
    ctx.fillText(Score, 650, 220);

    //White border for box
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(490,235,200,100);
    //Play box, black
    ctx.fillStyle = '#000000';
    ctx.fillRect(495,240,190,90);
    //Play button text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText("REPLAY",550,295);

    if (newHighscore == true){
    //newHighscores text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "50px Calibri";
    ctx.fillText("NEW",800,280);
    ctx.fillText("HIGH",798,320);
    ctx.fillText("SCORE",785,360);
    }

    //Highscores text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText("Highscores",490,370);

    //Highscore1 text
    var highscore1 = highscoresRKH4[(highscoresRKH4.length -1)];
    console.log(highscore1);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText(highscore1,645,370);
    //Highscore2 text
    var highscore2 = highscoresRKH4[(highscoresRKH4.length -2)];
    console.log(highscore2);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText(highscore2,645,400);
    //Highscore3 text
    var highscore3 = highscoresRKH4[(highscoresRKH4.length -3)];
    console.log(highscore3);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText(highscore3,645,430);			
    //Highscore4 text
    var highscore4 = highscoresRKH4[(highscoresRKH4.length -4)];
    console.log(highscore4);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText(highscore4,645,460);
    //Highscore5 text
    var highscore5 = highscoresRKH4[(highscoresRKH4.length -5)];
    console.log(highscore5);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText(highscore5,645,490);


    draw(crosshairImg,crosshairX,crosshairY);

    canv.addEventListener("mousedown",checkReplay,false);
}


function checkReplay(e){
    //Checks if the replay button is clicked
    if ((crosshairX < 690) && (crosshairX > 490) 
            && (crosshairY < 335) && (crosshairY > 235)){
        clearInterval(menu);
        clearInterval(game);
        menuState = false;
        start_game();
        Level = 01;
        Health = 100;
        Score = 01;
        tempScore = 0;
        spawnRate = 50;
        spawnCount = 40; 
        fireCount = 0;
        damage = 1;
        enemies.length = 0;
        bullets.length = 0;
    }
}




//Draws objects
function draw(obj,x,y){
    ctx.drawImage(obj,x,y);
}

//Heads up display function holding score, health & level count
function HUD(){
    //Score
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Calibri";
    ctx.fillText("Score  "+Score,1000,30);

    //Mothership health
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText("Health "+Health,810, 30);

    //Level count
    ctx.fillStyle = '#FFFFFF';
    ctx.font = "30px Calibri";
    ctx.fillText("level  "+Level,650, 30);

}


function collision_detection(object1, object2){
    if((object1.y + object1.height) < object2.y){return false;}
    else if (object1.y > (object2.y + object2.height)){return false;}
    else if ((object1.x + object1.width) < object2.x){return false;}
    else if (object1.x > (object2.x + object2.width)){return false;}
    else {
        return true;
    };
}

//Updates the position of each enemy
var xDistance;
var yDistance;
function update_enemy_position(arrayElement){
    if(enemies.length >0){
        xDistance = 620 - enemies[arrayElement].x;
        yDistance = 280 - enemies[arrayElement].y;
        targetDistance = Math.sqrt(xDistance * xDistance +
                            yDistance * yDistance);
        xDistance = xDistance / targetDistance;
        yDistance = yDistance / targetDistance;
        enemies[arrayElement].x += xDistance * enemies[arrayElement].speed;
        enemies[arrayElement].y += yDistance * enemies[arrayElement].speed;
        //Gravity element
        enemies[arrayElement].speed += 0.5;
    }
}

//updates the bullet position
function update_bullet_pos(index){
    var b = bullets[index];
    b.x += b.xDistance * b.speed;
    b.y += b.yDistance * b.speed;
}


var spawnX;
var spawnY;
var edge;
function spawn_enemy(){
    spawnCount++;
    if (spawnCount > spawnRate){
        spawnCount = 0;
        edge = Math.floor(Math.random() * (4) + 1);
        switch(edge) {
            //Top
            case 1: 
                spawnX = Math.random() * (1200 - 1) +1;
                spawnY = 1;
                break;
            //Right
            case 2:
                spawnX = 1190;
                spawnY = Math.random() * (600 - 1) + 1;
                break;
            //Bottom
            case 3:
                spawnX = Math.random() *(1200 - 1) + 1;
                spawnY = 580;
                break;
            //Left
            case 4:
                spawnX = 0;
                spawnY = Math.random() * (600 - 1) +1;
                break;
        }
        var tempEnemy = new enemy(spawnX,spawnY,5);
        enemies.push(tempEnemy);
    }
}

init();