var showed = false;
  var text;
  var stepsMade = 0;
  var stepsLeft,goal = 2000;
  var player1CurrentSteps,player1OldSteps;
	var stage_player1,stage_player2, w, h, loader;
	var sky, grant, ground, hill, hill2;
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

    stage_player2.addChild(sky, hill, hill2, ground, grant,text);

    stage_player2.addEventListener("stagemousedown", handleJumpStart);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    //get all players for demo purposes two players for example two id
    //remember current step count of player1 id and player2 id
    player1OldSteps = 5000;//get currentSteps
  }
	function handleJumpStart() {
		grant.gotoAndPlay("jump");
	}
	function tick(event) {
		var deltaS = event.delta / 1000;

    stepsMade += getSteps();
    stepsLeft = goal - stepsMade;
    var position = grant.x + getSteps() * deltaS;

    text.text = stepsLeft;
		var grantW = grant.getBounds().width * grant.scaleX;
		grant.x = (position >= w + grantW) ? -grantW : position;
		ground.x = (ground.x - deltaS * 150) % ground.tileW;
		hill.x = (hill.x - deltaS * 30);
		if (hill.x + hill.image.width * hill.scaleX <= 0) {
			hill.x = w;
		}
		hill2.x = (hill2.x - deltaS * 45);
		if (hill2.x + hill2.image.width * hill2.scaleX <= 0) {
			hill2.x = w;
		}

    if(stepsLeft >  0){
      stage_player1.update(event);
      stage_player2.update(event);


      console.log("NOW less than zero");
    }else{
      if(!showed){
        text.text = stepsLeft;
        stage_player1.update(event);
        stage_player2.update(event);

        alert("It's Over!");
        showed = true;
      }
    }

	}
  function getSteps(){
  player1CurrentSteps = player1OldSteps + Math.floor((Math.random() * 10) + 1);  //getCurrentSteps
  var diffSteps = player1CurrentSteps - player1OldSteps;
  player1OldSteps = player1CurrentSteps;
  return diffSteps;
  }
