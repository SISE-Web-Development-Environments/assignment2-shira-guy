var context;
var shape = new Object();
var monster1 = new Object();
var monster2 = new Object();
var monster3 = new Object();
var monster4 = new Object();
var monster5Good = new Object();
var specialFood = new Object();
var board;
var boardMonster;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
//var keyPressed;
var startA1;
var endA1;
var xC;
var yC;
var boardSize=10;

var moveMonsterCounter=0;
var counter1=0;
var counter2=0;
var counter3=0;
var counter4=0;
var counter5=0;

var life;


var lastVarx;
var lastVary;
var eyeX;
var eyeY;



//input from user
var color5 = "blue";	//fixme input from user
var color15 = "purple"; //fixme input from user
var color25 = "orange"; //fixme input from user
var totalFood=50; //fixme input from user
var totalNumOfMunsters = 4; //fixme input from user
var totalTime = 10;



var pacman_remain;



var isMonster5Alive;



/**
 * 0 - clean cell
 * 2 - pacman
 * 3 -
 * 4 - wall
 * 5 - monster1
 * 6 - monster2
 * 7 - monster3
 * 8 - monster4
 * 10 - food5
 * 11 - food15
 * 12 - food25
 * 13 - good character
 * 14 - specialFood
 */




$(document).ready(function() {
	context = canvas.getContext("2d");
	Start();
});




function Start() {
	board = new Array();
	boardMonster = new Array();
	score = 0;
	pac_color = "yellow";
	//var food_remain = totalFood;
	pacman_remain = 1;
	start_time = new Date();
	life = 5;

	for (var i = 0; i < boardSize; i++) {
		board[i] = new Array();
		boardMonster[i] = new Array();
		for (var j = 0; j < boardSize; j++) {
			buildWalls(i,j);
			buildMonsters(i,j);
			if ((board[i][j] != 4) && legalPlaceWithoutMonsters(i,j)) {
					board[i][j] = 0; //empty
			}
		}
	}

	buildPacman();
	buildFood();
	setTimeout(buildGoodMonster, 2000)
	//buildGoodMonster();
	buildKeyboards();
	buildSpecialFood();

	Draw(4); //Draw First pacman
	isMonster5Alive=true;

	interval = setInterval(function () {
		UpdatePosition();
		moveMonster();
		moveGoodMonster(isMonster5Alive);
	}, 200);

}//start


//****functions for start****

/**
 * build all the walls in the game
 * @param i
 * @param j
 */
function buildWalls(i, j){
	if ((i == 3 && j == 3) ||
		(i == 3 && j == 4) ||
		(i == 3 && j == 5) ||
		(i == 6 && j == 1) ||
		(i == 1 && j == 1) ||
		(i == 7 && j == 8) ||
		(i == 6 && j == 8) ||
		(i == 6 && j == 2)) {
		board[i][j] = 4; //wall
		boardMonster[i][j] = 4; //wall
	}
}

/**
 * create all the 4 monsters in the corners of the board
 * @param i
 * @param j
 */
function buildMonsters(i, j){
	if ((i == 0 && j == 0)){
		monster1.i = i;
		monster1.j = j;
		boardMonster[i][j] = 5; //monster1
	}
	if ((i == 0 && j == boardSize-1)){
		monster2.i = i;
		monster2.j = j;
		boardMonster[i][j] = 6; //monster2
	}
	if ((i == boardSize-1 && j == 0)){
		monster3.i = i;
		monster3.j = j;
		boardMonster[i][j] = 7; //monster3
	}
	if ((i == boardSize-1 && j == boardSize-1)){
		monster4.i = i;
		monster4.j = j;
		boardMonster[i][j] = 8; //monster4
	}
}

/**
 * initialize the keyboards
 */
function buildKeyboards() {
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);

	//todo maybe delete?
	window.addEventListener("keydown", function (e) {
		if ([32,37,38,39,40].indexOf(e.keyCode) > -1){
			e.preventDefault();
		}
	}, false)
}


/**
 * create pacman
 */
function buildPacman(){
	var flag = true;

	while (flag) {
		var restartPacman = findRandomEmptyCell(board); //fixme not on monsters

		if (((board[restartPacman[0]][restartPacman[1]] == 0) &&
			(legalPlaceWithoutMonsters(restartPacman[0], restartPacman[1])) == true) &&
			(areCoordinatesNotACorner(restartPacman[0], restartPacman[1]) == true)){

			shape.i = restartPacman[0];
			shape.j = restartPacman[1];
			board[shape.i][shape.j] = 2;//fixme

			flag = false;
		}
	}
}

/**
 * creates food according the number of food the user entered
 */
function buildFood(){
	var total5 =  Math.round(0.6 * totalFood);
	var total15 = Math.round(0.3 * totalFood);
	var total25 = totalFood - (total5 + total15);
	add5(total5);
	add15(total15);
	add25(total25);
}


/**
 * adds food of 5 points to the board
 * @param totalToAdd
 */
function add5(totalToAdd){
	var stop  = totalToAdd;
	while (stop > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 10;
		stop--;
	}
}

/**
 * adds food of 15 points to the board
 * @param totalToAdd
 */
function add15(totalToAdd){
	var stop  = totalToAdd;
	while (stop > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 11;
		stop--;
	}
}

/**
 * adds food of 25 points to the board
 * @param totalToAdd
 */
function add25(totalToAdd){
	var stop  = totalToAdd;
	while (stop > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 12;
		stop--;
	}
}


/**
 * creates a monster in a random place that when pacman eats it, it gets 50 points
 */
function buildGoodMonster(){ //fixme not on monsters?
	//var emptyCell = findRandomEmptyCell(board);
	var emptyCell = [0,0];
	monster5Good.i = emptyCell[0];
	monster5Good.j = emptyCell[1];
	boardMonster[emptyCell[0]][emptyCell[1]] = 13;
}


function buildSpecialFood(){ //todo what happens if it can't find a free cell?
	var emptyCell = findRandomEmptyCell(board);
	specialFood.i = emptyCell[0];
	specialFood.j = emptyCell[1];
	board[emptyCell[0]][emptyCell[1]] = 14;
}

//****start functions****







/**
 * calls all the monsters and move them correctly
 */
function moveMonster() {
	if (moveMonsterCounter%3==0) {
		moveMonster1();
		if(life==0){
			window.clearInterval(interval);
		}
		moveMonster2();
		if(life==0){
			window.clearInterval(interval);
		}
		moveMonster3();
		if(life==0){
			window.clearInterval(interval);
		}
		moveMonster4();
	}
	if(life==0){
		window.clearInterval(interval);
		window.alert("Loser");
	}
	moveMonsterCounter++;
}


/**
 * moves the good monster until pacman eats it
 * @param flag
 */
function moveGoodMonster(flag){
	if ((moveMonsterCounter%3==0) && flag) {
		moveMonster5();
	}
}


/**
 * move the monster to the right position
 */
 function moveMonster1(){
	 boardMonster[monster1.i][monster1.j] = 0;
	 if (counter1%2==0) {
		 var newVali = moveMonsterI(monster1.i, monster1.j);
		 monster1.i = newVali;
	 }
	 else {
		 var newValj = moveMonsterJ(monster1.i, monster1.j);
		 monster1.j = newValj;
	 }

	 boardMonster[monster1.i][monster1.j] = 5;
	 counter1++;
 }



/**
 * move the monster to the right position
 */
function moveMonster2(){
	boardMonster[monster2.i][monster2.j] = 0;

	if (counter2%2==0) {
		var newVali = moveMonsterI(monster2.i, monster2.j);
		monster2.i = newVali;
	}
	else {
		var newValj = moveMonsterJ(monster2.i, monster2.j);
		monster2.j = newValj;
	}

	boardMonster[monster2.i][monster2.j] = 6;
	counter2++;
}


/**
 * move the monster to the right position
 */
function moveMonster3(){

	boardMonster[monster3.i][monster3.j] = 0;

	if (counter3%2==0) {
		var newVali = moveMonsterI(monster3.i, monster3.j);
		monster3.i = newVali;
	}
	else {
		var newValj = moveMonsterJ(monster3.i, monster3.j);
		monster3.j = newValj;
	}

	boardMonster[monster3.i][monster3.j] = 7;
	counter3++;
}



/**
 * move the monster to the right position
 */
function moveMonster4(){

	boardMonster[monster4.i][monster4.j] = 0;

	if (counter4%2==0) {
		var newVali = moveMonsterI(monster4.i, monster4.j);
		monster4.i = newVali;
	}
	else {
		var newValj = moveMonsterJ(monster4.i, monster4.j);
		monster4.j = newValj;
	}

	boardMonster[monster4.i][monster4.j] = 8;
	counter4++;
}


/**
 * move the monster to the right position
 */
function moveMonster5(){

		boardMonster[monster5Good.i][monster5Good.j] = 0;

		if (counter5 % 2 == 0) {
			var newVali = moveRandomI(monster5Good.i, monster5Good.j);
			monster5Good.i = newVali;
		} else {
			var newVali = moveRandomJ(monster5Good.i, monster5Good.j);
			monster5Good.j = newVali;
		}

		boardMonster[monster5Good.i][monster5Good.j] = 13;
		counter5++;
}


/**
 * move coordinate x wisely with the pacman
 * @param iVal
 * @param jValue
 * @returns {*}
 */
function moveMonsterI(iVal, jValue){
	var ans;
	if ((iVal+1 <= shape.i) && (board[iVal+1][jValue] !=4) && ((iVal+1 >=0) && (iVal+1 <boardSize)) && legalPlaceWithoutMonsters(iVal+1, jValue)){ //fixme monsters
		ans = iVal+1;
		return ans;
	}
	else if ((iVal-1 >= shape.i) && (board[iVal-1][jValue] !=4)  && ((iVal-1 >=0) && (iVal-1 <boardSize)) && legalPlaceWithoutMonsters(iVal-1, jValue)){
		ans = iVal-1;
		return ans;
	}
	else{
		ans=iVal;
		return ans;
	}
}


/**
 * move coordinate y wisely with the pacman
 * @param iVal
 * @param jValue
 * @returns {*}
 */
function moveMonsterJ(iValue, jVal){
	var ans;
	if ((jVal+1 <= shape.j) && (board[iValue][jVal+1] !=4) && ((jVal+1 >= 0) && (jVal+1 < boardSize) && legalPlaceWithoutMonsters(iValue, jVal+1))){
		ans = jVal+1;
		return ans;
	}
	else if ((jVal-1 >= shape.j) && (board[iValue][jVal-1] !=4) && ((jVal-1 >= 0) && (jVal-1 < boardSize)) && legalPlaceWithoutMonsters(iValue, jVal-1)){
		ans = jVal-1;
		return ans;
	}
	else{
		ans=jVal;
		return ans;
	}
}


/**
 * moves I cell randomly
 * @param iVal
 * @param jVal
 * @returns {*}
 */
function moveRandomI(iVal, jVal){
	var ans;
	var plusOrMinus = Math.random() < 0.5 ? -1 : 1;

	if ((board[iVal+plusOrMinus][jVal] !=4) && ((iVal+plusOrMinus >=0) && (iVal+plusOrMinus < boardSize)) && legalPlaceWithoutMonsters(iVal+plusOrMinus, jVal)){ //fixme monsters
		ans = iVal+plusOrMinus;
		return ans;
	}
	else{
		ans=iVal;
		return ans;
	}
}

/**
 * moves J cell randomly
 * @param iVal
 * @param jVal
 * @returns {*}
 */
function moveRandomJ(iVal, jVal){
	var ans;
	var plusOrMinus = Math.random() < 0.5 ? -1 : 1;

	if ((board[iVal][jVal+plusOrMinus] !=4) && ((jVal+plusOrMinus >=0) && (jVal+plusOrMinus < boardSize)) && legalPlaceWithoutMonsters(iVal, jVal+plusOrMinus)){ //fixme monsters
		ans = jVal+plusOrMinus;
		return ans;
	}
	else{
		ans=jVal;
		return ans;
	}
}

/**
 * finds pacman a new random place
 */
function findPacmanPlace(){
	var flag = true;

	while (flag==true) {
		var emptyCellPacman = findRandomEmptyCell(board);

		if (((board[emptyCellPacman[0]][emptyCellPacman[1]] == 1) || (board[emptyCellPacman[0]][emptyCellPacman[1]] == 0)) &&
			((legalPlaceWithoutMonsters(emptyCellPacman[0], emptyCellPacman[1])) == true) &&
			((areCoordinatesNotACorner(emptyCellPacman[0], emptyCellPacman[1]) == true))){

			board[shape.i][shape.j] = 0;//fixme
			shape.i = emptyCellPacman[0];
			shape.j = emptyCellPacman[1];
			lastVarx = shape.i* 60 + 30 + eyeX;
			lastVary = shape.j* 60 + 30 + eyeY;
			flag = false;
		}
	}
}


/**
 * checks if there is a combination of the coordinates that creates a corner in the board
 * returns true is the coordinates not create a corner
 * returns false is the coordinates create a corner
 * @param checkI
 * @param checkJ
 * @returns {boolean}
 */
function areCoordinatesNotACorner(checkI, checkJ){
	if (((checkI != 0) && ((checkJ != 0))) && ((checkI != boardSize - 1) && ((checkJ != boardSize - 1))) &&
		((checkI != 0) && ((checkJ != boardSize - 1))) && ((checkI != boardSize - 1) && ((checkJ != 0)))){
		return true;
	}
	return false;

}




/**
 * checks if the coordinates clean from monsters
 * returns true if clean
 * returns false if there is a monster
 * @param posI
 * @param posJ
 * @returns {boolean}
 */
function legalPlaceWithoutMonsters(posI, posJ){
	if ((boardMonster[posI][posJ]!= 5) && (boardMonster[posI][posJ]!= 6) &&
		(boardMonster[posI][posJ]!= 7) && (boardMonster[posI][posJ]!= 8)){
		return true;
	}
	else{
		return false;
	}
}



/**
 * updates the position of pacman, and initialize Draw and DrawMonster functions
 * @constructor
 */
function UpdatePosition() {
	var food5 = 5;
	var food15 = 15;
	var food25 = 25;
	board[shape.i][shape.j] = 0;

	checkIfMonsterWithPacmanDifferentScore();


	var keyPressed = GetKeyPressed();
	if (keyPressed == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (keyPressed == 2) {
		if (shape.j < (boardSize-1) && board[shape.i][shape.j + 1] != 4) {
			shape.j++;

		}
	}
	if (keyPressed == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (keyPressed == 4) {
		if (shape.i < (boardSize-1) && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}

	if (board[shape.i][shape.j] == 10) { //5 score
		score= score + food5;
	}
	if (board[shape.i][shape.j] == 11) { // 15 score
		score= score + food15;
	}
	if (board[shape.i][shape.j] == 12) { // 25 score
		score = score + food25;
	}
	if (board[shape.i][shape.j] == 14) { // 25 score
		life = life + 2;
		board[shape.i][shape.j] == 0;
	}

	checkIfGoodMonsterWithPacman();

	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (time_elapsed == totalTime){
	 	window.clearInterval(interval);
	 	window.alert("Game completed");
	}

	// if (score >= 20 && time_elapsed <= 10) {
	// 	pac_color = "green";
	// }
	// if (score == 50) {
	// 	window.clearInterval(interval);
	// 	window.alert("Game completed");
	// } else {

		Draw(keyPressed);
	// }
}



/**
 * check if pacman and the monster on the same square.
 * If it does it initialize the board and low the life of pacman
 * If the life is 0 it stops the game
 */
function checkIfMonsterWithPacman(){
	if (((monster1.i == shape.i) && (monster1.j == shape.j)) ||
		((monster2.i == shape.i) && (monster2.j == shape.j)) ||
		((monster3.i == shape.i) && (monster3.j == shape.j)) ||
		((monster4.i == shape.i) && (monster4.j == shape.j))){
		life--;
		score = score - 10;
		findPacmanPlace();
		putMonstersInRightPlace();
	}else if(life==0){
		window.clearInterval(interval);
	}
}



/**
 * check if pacman and the monster on the same square.
 * If it does it initialize the board and low the life of pacman
 * If the life is 0 it stops the game
 */
function checkIfMonsterWithPacmanDifferentScore() {
	if (((monster1.i == shape.i) && (monster1.j == shape.j)) ||
		((monster2.i == shape.i) && (monster2.j == shape.j)) ||
		((monster3.i == shape.i) && (monster3.j == shape.j)) ||
		((monster4.i == shape.i) && (monster4.j == shape.j))) {


		if ((monster1.i == shape.i) && (monster1.j == shape.j)) {
			score = score - 5;
		} else if ((monster2.i == shape.i) && (monster2.j == shape.j)) {
			score = score - 15;
			life--;
		} else {
			score = score - 10;
		}
		life--;
		//score = score - 10;
		findPacmanPlace();
		putMonstersInRightPlace();
	} else if (life == 0) {
		window.clearInterval(interval);

	}
}


/**
 * check if pacman and the monster on the same square.
 * If it does it initialize the board and low the life of pacman
 * If the life is 0 it stops the game
 */
function checkIfGoodMonsterWithPacman() {
	if (((monster5Good.i == shape.i) && (monster5Good.j == shape.j) && isMonster5Alive)) {
		score = score + 50;
		boardMonster[monster5Good.i][monster5Good.j] = 0;
		isMonster5Alive = false;
	}
}


/**
 * put all the monsters in the corners
 */
function putMonstersInRightPlace(){

	boardMonster[monster1.i][monster1.j] = 0;
	boardMonster[monster2.i][monster2.j] = 0;
	boardMonster[monster3.i][monster3.j] = 0;
	boardMonster[monster4.i][monster4.j] = 0;

	monster1.i = 0;
	monster1.j = 0;
	boardMonster[monster1.i][monster1.j] = 5; //monster1

	monster2.i = 0;
	monster2.j = boardSize-1;
	boardMonster[monster2.i][monster2.j ] = 6; //monster2

	monster3.i = boardSize-1;
	monster3.j = 0;
	boardMonster[monster3.i][monster3.j] = 7; //monster3

	monster4.i = boardSize-1;
	monster4.j = boardSize-1;
	boardMonster[monster4.i][monster4.j] = 8; //monster4
}


/**
 * returns a cell the in the board there is an empty cell
 * @param board
 * @returns {number[]}
 */
function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * (boardSize-1) + 1);
	var j = Math.floor(Math.random() * (boardSize-1) + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * (boardSize-1) + 1);
		j = Math.floor(Math.random() * (boardSize-1) + 1);
	}
	return [i, j];
}


/**
 * returns the value of up, down, right, left
 * @returns {number}
 * @constructor
 */
function GetKeyPressed() {
	if (keysDown[38]) { //up
		return 1;
	}
	if (keysDown[40]) { //down
		return 2;
	}
	if (keysDown[37]) { //left
		return 3;
	}
	if (keysDown[39]) { //right
		return 4;
	}
}

/**
 * Draw all the board with pacman, food and walls
 * @param keyPressed
 * @constructor
 */
function Draw(keyPressed) {

	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;

	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			xC = lastVarx;
			yC = lastVary;


			if (board[i][j] == 2) {
				if(keyPressed==1){ //up
					startA1 = 1.65;
					endA1 = 1.35;
					xC = center.x - 15;
					yC = center.y + 5;
					eyeX= -15;
					eyeY = 5;
				}
				else if(keyPressed==2){ //down
					startA1 = 0.65;
					endA1 = 0.35;
					xC= center.x+15;
					yC = center.y - 5;
					eyeX= 15;
					eyeY = -5;
				}else if(keyPressed==3){ //left
					startA1 = 1.15;
					endA1 = 0.85;
					xC = center.x - 5;
					yC = center.y- 15;
					eyeX= -5;
					eyeY = -15;
				}else if(keyPressed==4) { //right
					startA1 = 0.15;
					endA1 = 1.85;
					xC = center.x + 5;
					yC = center.y - 15;
					eyeX= 5;
					eyeY = -15;
				}
				context.beginPath();
				context.arc(center.x, center.y, 25, startA1 * Math.PI, endA1 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(xC, yC, 4, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
				lastVarx = xC;
				lastVary = yC;
				}
			else if (boardMonster[i][j] == 13){	//monster5
					monster5_img = new Image();
					monster5_img.src = "pictures/cookieMonster2.png";
					context.drawImage(monster5_img, i*60+5, j*60+5, 45, 45);


			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();

			}
			else if (board[i][j] == 10) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = color5; //color
				context.fill();

			}else if (board[i][j] == 11) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = color15; //color
				context.fill();

			}else if (board[i][j] == 12) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = color25; //color
				context.fill();

			}else if (board[i][j] == 4) {
				// wall_image = new Image();
				// wall_image.src = "pictures/wall.png";
				// context.drawImage(wall_image, i*60+5, j*60+5, 60, 60);
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
			else if (board[i][j] == 14) {
				specialFood_image = new Image();
				specialFood_image.src = "pictures/strawberry.png";
				context.drawImage(specialFood_image, i*60+5, j*60+5, 40, 40);
			}

			DrawMonster();
		}
	}
}

/**
 * draw all the monsters
 * @constructor
 */
	function DrawMonster(){
		lblLife.value = life;

	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;

			if (boardMonster[i][j] == 5){ //monster1
				monster1_image = new Image();
				monster1_image.src = "pictures/monster1.png";
				context.drawImage(monster1_image, i*60+5, j*60+5, 40, 40);
			}
			else if (boardMonster[i][j] == 6){	//monster2
				monster2_image = new Image();
				monster2_image.src = "pictures/monster2.png";
				context.drawImage(monster2_image, i*60+5, j*60+5, 40, 40);
			}
			else if (boardMonster[i][j] == 7){	//monster3
				monster3_image = new Image();
				monster3_image.src = "pictures/monster3.png";
				context.drawImage(monster3_image, i*60+5, j*60+5, 40, 40);
			}
			else if (boardMonster[i][j] == 8) {	//monster4
				monster4_image = new Image();
				monster4_image.src = "pictures/monster4.png";
				context.drawImage(monster4_image, i * 60 + 5, j * 60 + 5, 40, 40);
			}
			else if (boardMonster[i][j] == 13){	//monster5
				monster5_img = new Image();
				monster5_img.src = "pictures/cookieMonster2.png";
				context.drawImage(monster5_img, i*60+5, j*60+5, 45, 45);
			}
		}
	}
}



