var showed = false;
  var text,text_2;
  var STEPSPEED = 5;
  var stepsMade_player1 = 0 ,stepsMade_player2 = 0;
  var stepsLeft_player1,stepsLeft_player2,goal = 20000;
  var player1CurrentSteps,player1OldSteps,player2CurrentSteps,player2OldSteps;


	var stage_player1,stage_player2, w, h, loader;
	var sky, grant, ground, hill, hill2;
  var sky_2, grant_2, ground_2, hill_2, hill2_2;

	function game_init() {
		examples.showDistractor();
		stage_player1 = new createjs.Stage("player1_Canvas");
    stage_player2 = new createjs.Stage("player2_Canvas");
		// grab canvas width and height for later calculations:
		w = stage_player1.canvas.width;
		h = stage_player1.canvas.height;
		manifest = [
			{src: "spritesheet_grant.png", id: "grant"},
			{src: "sky.png", id: "sky"},
			{src: "ground.png", id: "ground"},
			{src: "hill1.png", id: "hill"},
			{src: "hill2.png", id: "hill2"}
		];
		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete", handleComplete);
		loader.loadManifest(manifest, true, "../_assets/art/");
	}
	function handleComplete() {
		examples.hideDistractor();
    setUpPlayer1();
    setUpPlayer2();
		createjs.Ticker.addEventListener("tick", tick);
	}
  function setUpPlayer1(){
    sky = new createjs.Shape();
    sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, w, h);
    var groundImg = loader.getResult("ground");
    ground = new createjs.Shape();
    ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w + groundImg.width, groundImg.height);
    ground.tileW = groundImg.width;
    ground.y = h - groundImg.height;
    hill = new createjs.Bitmap(loader.getResult("hill"));
    hill.setTransform(Math.random() * w, h - hill.image.height * 4 - groundImg.height, 4, 4);
    hill.alpha = 0.5;
    hill2 = new createjs.Bitmap(loader.getResult("hill2"));
    hill2.setTransform(Math.random() * w, h - hill2.image.height * 3 - groundImg.height, 3, 3);
    var spriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        "images": [loader.getResult("grant")],
        "frames": {"regX": 82, "height": 292, "count": 64, "regY": 0, "width": 165},
        // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        "animations": {
          "run": [0, 25, "run", 1.5],
          "jump": [26, 63, "run"]
        }
      });
    grant = new createjs.Sprite(spriteSheet, "run");
    grant.y = 35;
    text = new createjs.Text("Hello", "20px Arial", "#ff7700");
    text.x = 100;
    text.y = 100;
    text.textBaseline = "alphabetic";

    stage_player1.addChild(sky, hill, hill2, ground, grant,text);

    stage_player1.addEventListener("stagemousedown", handleJumpStart);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    //get all players for demo purposes two players for example two id
    //remember current step count of player1 id and player2 id
    player1OldSteps = 5000;//get currentSteps
  }
  function setUpPlayer2(){
    sky_2 = new createjs.Shape();
    sky_2.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, w, h);
    var groundImg_2 = loader.getResult("ground");
    ground_2 = new createjs.Shape();
    ground_2.graphics.beginBitmapFill(groundImg_2).drawRect(0, 0, w + groundImg_2.width, groundImg_2.height);
    ground_2.tileW = groundImg_2.width;
    ground_2.y = h - groundImg_2.height;
    hill_2 = new createjs.Bitmap(loader.getResult("hill"));
    hill_2.setTransform(Math.random() * w, h - hill_2.image.height * 4 - groundImg_2.height, 4, 4);
    hill_2.alpha = 0.5;
    hill2_2 = new createjs.Bitmap(loader.getResult("hill2"));
    hill2_2.setTransform(Math.random() * w, h - hill2_2.image.height * 3 - groundImg_2.height, 3, 3);
    var spriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        "images": [loader.getResult("grant")],
        "frames": {"regX": 82, "height": 292, "count": 64, "regY": 0, "width": 165},
        // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        "animations": {
          "run": [0, 25, "run", 1.5],
          "jump": [26, 63, "run"]
        }
      });
    grant_2 = new createjs.Sprite(spriteSheet, "run");
    grant_2.y = 35;
    text_2 = new createjs.Text("Hello", "20px Arial", "#ff7700");
    text_2.x = 100;
    text_2.y = 100;
    text_2.textBaseline = "alphabetic";

    stage_player2.addChild(sky_2, hill_2, hill2_2, ground_2, grant_2,text_2);

    stage_player2.addEventListener("stagemousedown", handleJumpStart);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    //get all players for demo purposes two players for example two id
    //remember current step count of player1 id and player2 id
    player2OldSteps = 6000;//get currentSteps
  }
	function handleJumpStart() {
		grant.gotoAndPlay("jump");
	}
	function tick(event) {
		var deltaS = event.delta / 1000;
    stepsMade_player1 += getStepsPlayer1();
    console.log(getStepsPlayer1());
    stepsMade_player2 += getStepsPlayer2();
    var player1Left = update_Canvas1(deltaS,stepsMade_player1);
    var player2Left = update_Canvas2(deltaS,stepsMade_player2);
console.log(stepsMade_player1);
    if(goal - stepsMade_player1 > 0   || goal - stepsMade_player2 >  0){
      stage_player1.update(event);
      stage_player2.update(event);


    }else{
      if(!showed){

        stage_player1.update(event);
        stage_player2.update(event);

        alert("It's Over!");
        showed = true;
      }
    }

	}
  function update_Canvas1(delta,stepsMadePlayer1){
    stepsLeft_player1 = goal - stepsMade_player1;
    var position = grant.x + getStepsPlayer1() * delta;

    text.text = stepsLeft_player1;
		var grantW = grant.getBounds().width * grant.scaleX;
		grant.x = (position >= w + grantW) ? -grantW : position;
		ground.x = (ground.x - delta * 150) % ground.tileW;
		hill.x = (hill.x - delta * 30);
		if (hill.x + hill.image.width * hill.scaleX <= 0) {
			hill.x = w;
		}
		hill2.x = (hill2.x - delta * 45);
		if (hill2.x + hill2.image.width * hill2.scaleX <= 0) {
			hill2.x = w;
		}
    return stepsLeft_player1;

  }
  function update_Canvas2(delta,stepsMadePlayer1){
    stepsLeft_player2 = goal - stepsMade_player2;
    var position = grant_2.x + getStepsPlayer1() * delta;

    text_2.text = stepsLeft_player2;
		var grantW = grant_2.getBounds().width * grant_2.scaleX;
		grant_2.x = (position >= w + grantW) ? -grantW : position;
		ground_2.x = (ground_2.x - delta * 150) % ground_2.tileW;
		hill_2.x = (hill_2.x - delta * 30);
		if (hill_2.x + hill_2.image.width * hill_2.scaleX <= 0) {
			hill_2.x = w;
		}
		hill2_2.x = (hill2_2.x - delta * 45);
		if (hill2_2.x + hill2_2.image.width * hill2_2.scaleX <= 0) {
			hill2_2.x = w;
		}
return stepsLeft_player2;
  }

  function getStepsPlayer1(){
  player1CurrentSteps = player1OldSteps + Math.floor((Math.random() * 50) + 1) ;  //getCurrentSteps
  var diffSteps = player1CurrentSteps - player1OldSteps;
  player1OldSteps = player1CurrentSteps;
  return diffSteps * STEPSPEED;
  }
  function getStepsPlayer2(){
  player2CurrentSteps = player2OldSteps + Math.floor((Math.random() * 50) + 1);  //getCurrentSteps
  var diffSteps = player2CurrentSteps - player2OldSteps;
  player2OldSteps = player2CurrentSteps;
  return diffSteps * STEPSPEED;
  }
