//Brandon T. Wood Simple platformer for portfolio.
//Enemy ideas: Jumping Turtles, fast moving horizontial enemies and  Mario like Boo
// chromium-browser --allow-file-access-from-files

//Physics things and globals.
var METER    = 25;
var GRAVITY  = -0.1;           // very exagerated gravity (6x)
var MAX_VX    = 15;         // max horizontal speed (20 tiles per second)
var MAX_VY    = 10;         // max vertical speed   (60 tiles per second)
var ONGROUND = false;
var LEVEL = 0;
var READY  = 0;;
var player, stage, renderer;   
var platform = [];
// This is for gravity and acceleration stuff.
var t2 = 1, t1 = 1, t0 = 1;
var level_text;
var enemies = [];
var projectiles = [];
var keys = {};
document.onkeydown = function(e) { keys[e.which] = true };
document.onkeyup = function(e) { keys[e.which] = false };


//var stage, renderer;
function init(){

  stage = new PIXI.Container();
  var canvas = document.getElementById("game");
  renderer = PIXI.autoDetectRenderer(1000, 500, {view:canvas});
  renderer.backgroundColor = 0xffffff;
  canvas.focus();


  // Lets add some title text!
  var text = new PIXI.Text("Malceore. o", {font:"70px Arial", fill:"0x333333"});
  stage.addChild(text);

  // First description thing. REMOVED

  var desc2 = new PIXI.Text("Resume", {font:"20px Arial", fill:"0x333333"});
  desc2.position.y = 45;
  desc2.position.x = 810;
  desc2.buttonMode = true;
  desc2.interactive = true;
  desc2.mouseover = function(e){
    this.position.y -= 3;
  } 
  desc2.mouseout = function(e){
    this.position.y += 3;
  }
  desc2.click = function(e){
    window.location='https://docs.google.com/document/d/1IUCBXh82fUx7siUjwITJhSLKyNOS7PmW9SUqAWnQ7jM/pub';
  }
  stage.addChild(desc2);

  var desc3 = new PIXI.Text("Contact", {font:"20px Arial", fill:"0x333333"});
  desc3.position.y = 45;
  desc3.position.x = 710;
  desc3.interactive = true;
  desc3.buttonMode = true;
  desc3.mouseover = function(e){
    this.position.y -= 3;
    //console.log("touchie!");
  } 
  desc3.mouseout = function(e){
    this.position.y += 3;
  }
  desc3.click = function(e){

    var banner = new PIXI.Sprite.fromImage("res/contact.png");
    banner.position.y = 90;
    banner.position.x = 690;
    stage.addChild(banner);

    // Sprite holding left side of banner.
    var spriteL = new PIXI.Sprite.fromImage("res/bogurt.png");
    spriteL.anchor.x = 0.5;
    spriteL.anchor.y = 0.5;
    spriteL.position.y = 108;
    spriteL.position.x = 665;
    stage.addChild(spriteL);

    // Sprite holding the right side of banner.
    var spriteR = new PIXI.Sprite.fromImage("res/bogurt.png");
    spriteR.anchor.x = 0.5;
    spriteR.anchor.y = 0.5;
    spriteR.scale.x = -1;
    spriteR.position.y = 108;
    spriteR.position.x = 895;
    stage.addChild(spriteR);	
	
  }
  stage.addChild(desc3);


  //Portrait graphics.
  platform[0] = new PIXI.Graphics();
  platform[0].beginFill(0xe6e6e6);
  platform[0].position.x = 70;
  platform[0].position.y = 125;
  platform[0].drawRoundedRect(0, 0, 280, 330, 5);
  stage.addChild(platform[0]);

  // Portrait text
  var name = new PIXI.Text("Brandon T. Wood", {font:"25px Arial", fill:"0x333333"});
  name.position.y = 420;
  name.position.x = 109;
  stage.addChild(name);

  // Top three things, first
  platform[1] = new PIXI.Graphics();
  platform[1].beginFill(0xe6e6e6);
  platform[1].position.x = 400;
  platform[1].position.y = 150;
  platform[1].drawRoundedRect(0, 0, 480, 55, 5);
  stage.addChild(platform[1]);

  var text1 = new PIXI.Text("I am a Software Engineer and Front end web developer with a \nstrong foundation in Java and agile software development.", {font:"16px Arial", fill:"0x333333"});
  text1.position.y = 158;
  text1.position.x = 415;
  stage.addChild(text1);

  // Second
  platform[2] = new PIXI.Graphics();
  platform[2].beginFill(0xe6e6e6);
  platform[2].position.x = 400;
  platform[2].position.y = 270;
  platform[2].drawRoundedRect(0, 0, 480, 55, 5);
  stage.addChild(platform[2]);

  var text2 = new PIXI.Text("I have a B.S. in Computer Science from SUNY Potsdam with a \nminor is Business Administration.", {font:"16px Arial", fill:"0x333333"});
  text2.position.y = 280;
  text2.position.x = 415;
  stage.addChild(text2);

  // Third
  platform[3] = new PIXI.Graphics();
  platform[3].beginFill(0xe6e6e6);
  platform[3].position.x = 400;
  platform[3].position.y = 390;
  platform[3].drawRoundedRect(0, 0, 480, 55, 5);
  stage.addChild(platform[3]);

  var text2 = new PIXI.Text("In my free time I enjoy designing video games, gardening and \nplaying table top games.", {font:"16px Arial", fill:"0x333333"});
  text2.position.y = 398;
  text2.position.x = 415;
  stage.addChild(text2);

  // Where it tells you the level has begun.
  level_text = new PIXI.Text("Level 1 - 1", {font:"35px Arial", fill:"0x333333"});
  level_text.position.y = 200;
  level_text.position.x = 380;
  level_text.visible = false;
  stage.addChild(level_text);


  // Links bar 1
  platform[4] = new PIXI.Graphics();
  platform[4].beginFill(0x333333);
  platform[4].position.x = 0;
  platform[4].position.y = 68;
  platform[4].drawRoundedRect(0, 0, 400, 5, 5);
  stage.addChild(platform[4]);

  // Link bar text.
  var instr1 = new PIXI.Text("Use W, A, S and D to move bunny.", {font:"15px Arial", fill:"0x333333"});
  instr1.position.y = 72;
  instr1.position.x = 85;
  stage.addChild(instr1);

  // link bar 2
  platform[5] = new PIXI.Graphics();
  platform[5].beginFill(0x333333);
  platform[5].position.x = 490;
  platform[5].position.y = 68;
  platform[5].drawRect(0, 0, 400, 5);
  stage.addChild(platform[5]);

  // Second bar text.
  var instr2 = new PIXI.Text("Press J to fire carrots, have fun.", {font:"15px Arial", fill:"0x333333"});
  instr2.position.y = 72;
  instr2.position.x = 615;
  stage.addChild(instr2);


  // Bottom bar
  platform[6] = new PIXI.Graphics();
  platform[6].beginFill(0x333333);
  platform[6].position.x = 0;
  platform[6].position.y = 500;
  platform[6].drawRect(0, 0, 1000, 25);
  stage.addChild(platform[6]);

  // Player character setup.
  player = new PIXI.Sprite.fromImage("res/bunny.png");
  player.position.x = 315;
  player.position.y = 44;
  player.anchor.x = 0.5;
  player.anchor.y = 1;
  player.scale.x = 0.8;
  player.scale.y = 1.2;
  stage.addChild(player);
  player.vy = 0;
  player.vx = 0;
  
  renderer.render(stage);
  requestAnimationFrame(animate);
};


function hitTest(a, b) {
  if(a.position.x < (b.position.x + b.width) && a.position.x > b.position.x){
    if(a.position.y < (b.position.y + b.height) && a.position.y > b.position.y){
      return true;
    }
  }
  return false;
};

function movePlayer(){

  // Check for collisions.
  for(var i=0; platform.length>i; i++){
    if(hitTest(player, platform[i])){

      ONGROUND = true;
      player.vy = 0;//platform[i].position.y +1;
      break;
    }else{

      ONGROUND = false;
    }
  }
  // Left
  if(keys[65]) {

      //console.log(player.vy);
      player.vx = -3;
      player.scale.x = -1;
  // right cannot be pressed along side left.
  }else if(keys[68]) {

      //console.log('Right was pressed');
      player.vx = 3;
      player.scale.x = 1;
  } else{

      player.vx = 0;
  }

  // Jump
  if(keys[87] && player.vy < MAX_VY) {
      if(ONGROUND){

        t0=t2;//d.getSeconds();
      }
      player.vy = -190 / ((t2-t0) + 40);
      //console.log(player.vy);
  }else{

      player.vy = 0;
  }

  //Down
  if(keys[83]) {

      //console.log('Down was pressed');
      player.vy = 0;
      player.vx = 0;
  }

  // Move player, apply changes.
  player.position.x += player.vx;
  if(ONGROUND){

      player.position.y += player.vy;
  }else{

      if(player.vy > -MAX_VY +5){

        //Else he is in the air/jumping.
        player.position.y += player.vy - GRAVITY * ((t2 - t0) + 1);
      }else{

        player.position.y = MAX_VY;
      }
      t2++;
  }

  //Fire key pressed.
  if(keys[74]){

    var fire
    //console.log("Fire");
    if(player.scale.x == 1){
      fire = new missleR();
    }else if(player.scale.x == -1){
      fire = new missleL();
    }
    stage.addChild(fire.sprite);
  }


  // Wait til player gets used to controls before moving.
  if(t2 == 200){
      LEVEL++;
  }else if(t2 == 201){

      LEVEL++;
      //console.log("	It begins, monsters spawn.");

      var monster1 = new squid();
      monster1.sprite.position.x = -90;
      stage.addChild(monster1.sprite);

      var monster2 = new squid();
      monster2.sprite.position.y = 300;
      monster2.sprite.position.x = -90;
      stage.addChild(monster2.sprite);

      var monster3 = new squid();
      monster3.sprite.position.y = 300;
      monster3.sprite.position.x = 1100;
      stage.addChild(monster3.sprite);
  }

  // Insert win conditions for each level to increment it..
  if(enemies.length <= 0 && LEVEL > 1){
    LEVEL++;

    var monster1 = new squid();
    monster1.sprite.position.x = -90;
    stage.addChild(monster1.sprite);

    var monster2 = new squid();
    monster2.sprite.position.y = 300;
    monster2.sprite.position.x = -90;
    stage.addChild(monster2.sprite);

    var monster3 = new squid();
    monster3.sprite.position.y = 300;
    monster3.sprite.position.x = 1100;
    stage.addChild(monster3.sprite);

  }

};

function missleL(){

  this.sprite = new PIXI.Text("<{|||}<", {font:"18px Arial", fill:"0xff751a"});
  this.sprite.position.x = player.position.x;
  this.sprite.position.y = (player.position.y-10);
  projectiles.push(this.sprite);
};

function missleR(){

  this.sprite = new PIXI.Text(">{|||}>", {font:"18px Arial", fill:"0xff751a"});
  this.sprite.position.x = player.position.x;
  this.sprite.position.y = (player.position.y-10);
  projectiles.push(this.sprite);
};

function bug(){

  this.sprite = new PIXI.Sprite.fromImage("res/bug.png");
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 0.5;
  enemies.push(this.sprite);
};

function squid(){

  this.sprite = new PIXI.Sprite.fromImage("res/bogurt.png");
  //this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1.0;
  enemies.push(this.sprite);
};

function moveProj(){
  for(var i=0; i<projectiles.length; i++){
    if(projectiles[i].text == "<{|||}<"){
      projectiles[i].position.x -= 3;
    }else{
      projectiles[i].position.x += 3;
    }
    //Check if hit monster.
    for(var j=0; j<enemies.length; j++){
      if( hitTest(projectiles[i], enemies[j]) ){
        //console.log("hit!");
        stage.removeChild(enemies[j]);
        enemies.splice(j,1);
        //console.log(enemies);
      }
    }
  }
};


function checkAI(){

  for(var i=0; i<enemies.length; i++){

    //enemies[i].position.x += 5;
    //check what type of enemy it is. comming soon, only squid now.
    if(enemies[i].position.x < player.position.x){

      enemies[i].position.x += 1;
      enemies[i].scale.x = 1;
    }else{

      enemies[i].position.x -= 1;
      enemies[i].scale.x = -1;
    }

    if(enemies[i].position.y < player.position.y){
      enemies[i].position.y += 1;
    }else{
      enemies[i].position.y -= 1;
    }
    
  }
};


// ---------------------- MAIN LOOP -------------------------
function animate(){

  // The above function.
  movePlayer();

  // Calculate AI
  checkAI();

  // Check movement of projectiles.
  moveProj();

  // Do level building stuff here.
  if(LEVEL == 1){

    //console.log("	Level 1 - 1");
    level_text.visible = true;
  }else if(LEVEL == 3){

    level_text.visible = false;
    // Send in the enemies
  }


//else if(LEVEL == 5){
    //console.log("	Level 1 - 2");
  //  level_text.setText("Level 1 - 2");
    //level_text.visible = true;
    //LEVEL++;
  //}else if(LEVEL == 6){

    //level_text.visible = false;
  //}


  // Render frames.
  renderer.render(stage);
  requestAnimationFrame(animate);
};


