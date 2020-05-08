var context;
var shape = new Object();
var monster1;
var monster2;
var monster3;
var monster4;
var monster5Good = new Object();
var specialFood = new Object();
var board;
var boardFrame;
var boardMonster;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var startA1;
var endA1;
var xC;
var yC;
var boardSize = 17;

var moveMonsterCounter = 0;
var counter1 = 0;
var counter2 = 0;
var counter3 = 0;
var counter4 = 0;
var counter5 = 0;

var life;
var lastVarx;
var lastVary;
var eyeX;
var eyeY;


var pacman_remain;
var size = 40;


var isMonster5Alive;
var totalTime;
var totalFood;
var keyUp;
var keyDown;
var keyLeft;
var keyRight;
var isMonster1;
var isMonster2;
var isMonster3;
var isMonster4;
var color5;
var color15;
var color25;
var nameUser;


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


$(document).ready(function () {
	localStorage.setItem('p', 'p');
	context = canvas.getContext("2d");
	openTab(event, 'Welcome');
});

function Start() {
    setDisable();
    playMusicGame(); //todo add!!!!!!!!
	window.clearInterval(interval);
	openTab(event, 'startGame');
	context.clearRect(0, 0, canvas.width, canvas.height);
	setGameProperties();
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
			buildWalls(i, j);
			buildMonsters(i, j);
			if ((board[i][j] != 4) && legalPlaceWithoutMonsters(i, j)) {
				board[i][j] = 0; //empty
			}
		}
	}

	buildPacman();
	buildFood();
	//setTimeout(buildGoodMonster, 2000);
	buildGoodMonster();
	buildKeyboards();
	buildSpecialFood();

	draw(4); //Draw First pacman
	isMonster5Alive = true;

	interval = setInterval(function () {
		updatePosition();
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
function buildWalls(i, j) {


	if ((i == 0) ||
		(j == 0) ||
		(i == boardSize -1) ||
		(j == boardSize -1) ||
		(i == 2 && j == 3) ||
		(i == 3 && j == 3) ||
		(i == 6 && j == 3) ||
		(i == 8 && j == 1) ||
		(i == 8 && j == 2) ||
		(i == 8 && j == 3) ||
		(i == 10 && j == 3) ||
		(i == 13 && j == 3) ||
		(i == 14 && j == 3) ||
		(i == 6 && j == 5) ||
		(i == 7 && j == 5) ||
		(i == 8 && j == 5) ||
		(i == 9 && j == 5) ||
		(i == 10 && j == 5) ||
		(i == 8 && j == 6) ||
		(i == 1 && j == 7) ||
		(i == 2 && j == 7) ||
		(i == 14 && j == 7) ||
		(i == 15 && j == 7) ||
		(i == 5 && j == 8) ||
		(i == 6 && j == 8) ||
		(i == 10 && j == 8) ||
		(i == 11 && j == 8) ||
		(i == 1 && j == 9) ||
		(i == 2 && j == 9) ||
		(i == 14 && j == 9) ||
		(i == 15 && j == 9) ||
		(i == 8 && j == 10) ||
		(i == 6 && j == 11) ||
		(i == 7 && j == 11) ||
		(i == 8 && j == 11) ||
		(i == 9 && j == 11) ||
		(i == 10 && j == 11) ||
		(i == 2 && j == 13) ||
		(i == 3 && j == 13) ||
		(i == 6 && j == 13) ||
		(i == 8 && j == 13) ||
		(i == 10 && j == 13) ||
		(i == 13 && j == 13) ||
		(i == 14 && j == 13) ||
		(i == 8 && j == 14) ||
		(i == 8 && j == 15))
	{
		board[i][j] = 4; //wall
		boardMonster[i][j] = 4; //wall
	}

}

/**
 * create all the 4 monsters in the corners of the board
 * @param i
 * @param j
 */
function buildMonsters(i, j) {
	if ((isMonster1 && (i == 1 && j == 1))) { //fixme
		monster1 = new Object();
		monster1.i = i;
		monster1.j = j;
		boardMonster[i][j] = 5; //monster1
	}
	if (isMonster2 && ((i == 1 && j == boardSize - 2))) { //fixme
		monster2 = new Object();
		monster2.i = i;
		monster2.j = j;
		boardMonster[i][j] = 6; //monster2
	}
	if (isMonster3 && ((i == boardSize - 2 && j == 1))) { //fixme
		monster3 = new Object();
		monster3.i = i;
		monster3.j = j;
		boardMonster[i][j] = 7; //monster3
	}
	if (isMonster4 && ((i == boardSize - 2 && j == boardSize - 2))) { //fixme
		monster4 = new Object();
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
		if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	}, false)
}


/**
 * create pacman
 */
function buildPacman() {
	var flag = true;

	while (flag) {
		var restartPacman = findRandomEmptyCell(board); //fixme not on monsters

		if (((board[restartPacman[0]][restartPacman[1]] == 0) &&
			(legalPlaceWithoutMonsters(restartPacman[0], restartPacman[1])) == true) &&
			(areCoordinatesNotACorner(restartPacman[0], restartPacman[1]) == true)) {

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
function buildFood() {
	var total5 = Math.round(0.6 * totalFood);
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
function add5(totalToAdd) {
	var stop = totalToAdd;
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
function add15(totalToAdd) {
	var stop = totalToAdd;
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
function add25(totalToAdd) {
	var stop = totalToAdd;
	while (stop > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 12;
		stop--;
	}
}


/**
 * creates a monster in a random place that when pacman eats it, it gets 50 points
 */
function buildGoodMonster() { //fixme not on monsters?
	//var emptyCell = findRandomEmptyCell(board);
	var emptyCell = [1, 1]; //fixme!!!!
	monster5Good.i = emptyCell[0];
	monster5Good.j = emptyCell[1];
	boardMonster[emptyCell[0]][emptyCell[1]] = 13;
}


function buildSpecialFood() { //todo what happens if it can't find a free cell?
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
	if (moveMonsterCounter % 3 == 0) {
		if (isMonster1) {
			moveMonster1();
			if (life <= 0) {
				window.clearInterval(interval);
			}
		}
		if (isMonster2) {
			moveMonster2();
			if (life <= 0) {
				window.clearInterval(interval);
			}
		}
		if (isMonster3) {
			moveMonster3();
			if (life <= 0) {
				window.clearInterval(interval);
			}
		}
		if (isMonster4) {
			moveMonster4();
		}
	}

	if (life <= 0) {
	    cleanBoard(); //todo!!!!!
        draw();
        stopMusicGame(); //todo add!!!!!!!
        playMusicDeath(); //todo add!!!!!
		window.clearInterval(interval);
		window.alert("Loser");
		setAble();
	}
	moveMonsterCounter++;
}


/**
 * moves the good monster until pacman eats it
 * @param flag
 */
function moveGoodMonster(flag) {
	if ((moveMonsterCounter % 3 == 0) && flag) {
		moveMonster5();
	}
}


/**
 * move the monster to the right position
 */
function moveMonster1() {
	boardMonster[monster1.i][monster1.j] = 0;
	if (counter1 % 2 == 0) {
		var newVali = moveMonsterI(monster1.i, monster1.j);
		monster1.i = newVali;
	} else {
		var newValj = moveMonsterJ(monster1.i, monster1.j);
		monster1.j = newValj;
	}

	boardMonster[monster1.i][monster1.j] = 5;
	counter1++;
}


/**
 * move the monster to the right position
 */
function moveMonster2() {
	boardMonster[monster2.i][monster2.j] = 0;

	if (counter2 % 2 == 0) {
		var newVali = moveMonsterI(monster2.i, monster2.j);
		monster2.i = newVali;
	} else {
		var newValj = moveMonsterJ(monster2.i, monster2.j);
		monster2.j = newValj;
	}

	boardMonster[monster2.i][monster2.j] = 6;
	counter2++;
}


/**
 * move the monster to the right position
 */
function moveMonster3() {

	boardMonster[monster3.i][monster3.j] = 0;

	if (counter3 % 2 == 0) {
		var newVali = moveMonsterI(monster3.i, monster3.j);
		monster3.i = newVali;
	} else {
		var newValj = moveMonsterJ(monster3.i, monster3.j);
		monster3.j = newValj;
	}

	boardMonster[monster3.i][monster3.j] = 7;
	counter3++;
}


/**
 * move the monster to the right position
 */
function moveMonster4() {

	boardMonster[monster4.i][monster4.j] = 0;

	if (counter4 % 2 == 0) {
		var newVali = moveMonsterI(monster4.i, monster4.j);
		monster4.i = newVali;
	} else {
		var newValj = moveMonsterJ(monster4.i, monster4.j);
		monster4.j = newValj;
	}

	boardMonster[monster4.i][monster4.j] = 8;
	counter4++;
}


/**
 * move the monster to the right position
 */
function moveMonster5() {

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
function moveMonsterI(iVal, jValue) {
	var ans;
	if ((iVal + 1 <= shape.i) && (board[iVal + 1][jValue] != 4) && ((iVal + 1 >= 0) && (iVal + 1 < boardSize)) && legalPlaceWithoutMonsters(iVal + 1, jValue)) { //fixme monsters
		ans = iVal + 1;
		return ans;
	} else if ((iVal - 1 >= shape.i) && (board[iVal - 1][jValue] != 4) && ((iVal - 1 >= 0) && (iVal - 1 < boardSize)) && legalPlaceWithoutMonsters(iVal - 1, jValue)) {
		ans = iVal - 1;
		return ans;
	} else {
		ans = iVal;
		return ans;
	}
}


/**
 * move coordinate y wisely with the pacman
 * @param iVal
 * @param jValue
 * @returns {*}
 */
function moveMonsterJ(iValue, jVal) {
	var ans;
	if ((jVal + 1 <= shape.j) && (board[iValue][jVal + 1] != 4) && ((jVal + 1 >= 0) && (jVal + 1 < boardSize) && legalPlaceWithoutMonsters(iValue, jVal + 1))) {
		ans = jVal + 1;
		return ans;
	} else if ((jVal - 1 >= shape.j) && (board[iValue][jVal - 1] != 4) && ((jVal - 1 >= 0) && (jVal - 1 < boardSize)) && legalPlaceWithoutMonsters(iValue, jVal - 1)) {
		ans = jVal - 1;
		return ans;
	} else {
		ans = jVal;
		return ans;
	}
}


/**
 * moves I cell randomly
 * @param iVal
 * @param jVal
 * @returns {*}
 */
function moveRandomI(iVal, jVal) {
	var ans;
	var plusOrMinus = Math.random() < 0.5 ? -1 : 1;

	if ((board[iVal + plusOrMinus][jVal] != 4) && ((iVal + plusOrMinus >= 0) && (iVal + plusOrMinus < boardSize)) && legalPlaceWithoutMonsters(iVal + plusOrMinus, jVal)) { //fixme monsters
		ans = iVal + plusOrMinus;
		return ans;
	} else {
		ans = iVal;
		return ans;
	}
}

/**
 * moves J cell randomly
 * @param iVal
 * @param jVal
 * @returns {*}
 */
function moveRandomJ(iVal, jVal) {
	var ans;
	var plusOrMinus = Math.random() < 0.5 ? -1 : 1;

	if ((board[iVal][jVal + plusOrMinus] != 4) && ((jVal + plusOrMinus >= 0) && (jVal + plusOrMinus < boardSize)) && legalPlaceWithoutMonsters(iVal, jVal + plusOrMinus)) { //fixme monsters
		ans = jVal + plusOrMinus;
		return ans;
	} else {
		ans = jVal;
		return ans;
	}
}

/**
 * finds pacman a new random place
 */
function findPacmanPlace() {
	var flag = true;

	while (flag == true) {
		var emptyCellPacman = findRandomEmptyCell(board);

		if (((board[emptyCellPacman[0]][emptyCellPacman[1]] == 1) || (board[emptyCellPacman[0]][emptyCellPacman[1]] == 0)) &&
			((legalPlaceWithoutMonsters(emptyCellPacman[0], emptyCellPacman[1])) == true) &&
			((areCoordinatesNotACorner(emptyCellPacman[0], emptyCellPacman[1]) == true))) {

			board[shape.i][shape.j] = 0;//fixme
			shape.i = emptyCellPacman[0];
			shape.j = emptyCellPacman[1];
			lastVarx = shape.i * size + 25 + eyeX;
			lastVary = shape.j * size + 25 + eyeY;
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
function areCoordinatesNotACorner(checkI, checkJ) {
	if (((checkI != 0) && ((checkJ != 0))) && ((checkI != boardSize - 1) && ((checkJ != boardSize - 1))) &&
		((checkI != 0) && ((checkJ != boardSize - 1))) && ((checkI != boardSize - 1) && ((checkJ != 0)))) {
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
function legalPlaceWithoutMonsters(posI, posJ) {
	if ((boardMonster[posI][posJ] != 5) && (boardMonster[posI][posJ] != 6) &&
		(boardMonster[posI][posJ] != 7) && (boardMonster[posI][posJ] != 8)) {
		return true;
	} else {
		return false;
	}
}


/**
 * updates the position of pacman, and initialize Draw and DrawMonster functions
 * @constructor
 */
function updatePosition() {
	var food5 = 5;
	var food15 = 15;
	var food25 = 25;
	board[shape.i][shape.j] = 0;

	checkIfMonsterWithPacmanDifferentScore();


	var keyPressed = getKeyPressed();
	if (keyPressed == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (keyPressed == 2) {
		if (shape.j < (boardSize - 1) && board[shape.i][shape.j + 1] != 4) {
			shape.j++;

		}
	}
	if (keyPressed == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (keyPressed == 4) {
		if (shape.i < (boardSize - 1) && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}

	if (board[shape.i][shape.j] == 10) { //5 score
		score = score + food5;
	}
	if (board[shape.i][shape.j] == 11) { // 15 score
		score = score + food15;
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
	time_elapsed = Math.round(totalTime - (currentTime - start_time) / 1000);
	if (time_elapsed <= 0) {
		if (score < 100) {
            cleanBoard();//todo add!!!
            draw();
            stopMusicGame(); //todo add!!!!!!!
            playMusicDeath(); //todo add!!!!!
            window.clearInterval(interval);
			window.alert("You are better than " + score + " points!");
			setAble();
		} else {
            stopMusicGame(); //todo add!!!!!!!
            playMusicWin();
            cleanBoard();//todo add!!!
            draw();
            window.clearInterval(interval);
			window.alert("Winner!!!");
			setAble();
		}
	}

	if(isGameFinished()){
        stopMusicGame(); //todo add!!!!!!!
        playMusicWin();
        cleanBoard();//todo add!!!
        draw();
        window.clearInterval(interval);
        window.alert("Winner!!!");
		setAble();
	}

	// if (score >= 20 && time_elapsed <= 10) {
	// 	pac_color = "green";
	// }
	// if (score == 50) {
	// 	window.clearInterval(interval);
	// 	window.alert("Game completed");
	// } else {

	draw(keyPressed);
	// }
}

function isGameFinished(){
    var flag=true;
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            if ((board[i][j] == 10) || (board[i][j] == 11) || (board[i][j] == 12)) {
                flag=false;
            }
        }
    }
    return flag;
}

/**
 * check if pacman and the monster on the same square.
 * If it does it initialize the board and low the life of pacman
 * If the life is 0 it stops the game
 */
function checkIfMonsterWithPacman() {
	if (((monster1.i == shape.i) && (monster1.j == shape.j)) ||
		((monster2.i == shape.i) && (monster2.j == shape.j)) ||
		((monster3.i == shape.i) && (monster3.j == shape.j)) ||
		((monster4.i == shape.i) && (monster4.j == shape.j))) {
		life--;
		score = score - 10;
		findPacmanPlace();
		putMonstersInRightPlace();
	} else if (life <= 0) {
		window.clearInterval(interval);
	}
}


/**
 * check if pacman and the monster on the same square.
 * If it does it initialize the board and low the life of pacman
 * If the life is 0 it stops the game
 */
function checkIfMonsterWithPacmanDifferentScore() {
	if ((isMonster1 && (monster1.i == shape.i) && (monster1.j == shape.j)) ||
		(isMonster2 && (monster2.i == shape.i) && (monster2.j == shape.j)) ||
		(isMonster3 && (monster3.i == shape.i) && (monster3.j == shape.j)) ||
		(isMonster4 && (monster4.i == shape.i) && (monster4.j == shape.j))) {


		if (isMonster1 && (monster1.i == shape.i) && (monster1.j == shape.j)) {
			score = score - 5;
		} else if (isMonster2 && (monster2.i == shape.i) && (monster2.j == shape.j)) {
			score = score - 15;
			life--;
		} else if (isMonster3 && monster3.i == shape.i && (monster3.j == shape.j)) {
			score = score - 10;
		} else if (isMonster4 && monster4.i == shape.i && (monster4.j == shape.j)) {
			score = score - 10;
		}
		life--;
		//score = score - 10;
		findPacmanPlace();
		putMonstersInRightPlace();
	} else if (life <= 0) {
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
function putMonstersInRightPlace() {
	if (isMonster1) {
		putMonster1();
	}
	if (isMonster2) {
		putMonster2();
	}
	if (isMonster3) {
		putMonster3();
	}
	if (isMonster4) {
		putMonster4();
	}
}

function putMonster1() {
	boardMonster[monster1.i][monster1.j] = 0;
	monster1.i = 1;
	monster1.j = 1;
	boardMonster[monster1.i][monster1.j] = 5; //monster1
}

function putMonster2() {
	boardMonster[monster2.i][monster2.j] = 0;
	monster2.i = 1;
	monster2.j = boardSize - 2;
	boardMonster[monster2.i][monster2.j] = 6; //monster2
}

function putMonster3() {
	boardMonster[monster3.i][monster3.j] = 0;
	monster3.i = boardSize - 2;
	monster3.j = 1;
	boardMonster[monster3.i][monster3.j] = 7; //monster3
}

function putMonster4() {

	boardMonster[monster4.i][monster4.j] = 0;
	monster4.i = boardSize - 2;
	monster4.j = boardSize - 2;
	boardMonster[monster4.i][monster4.j] = 8; //monster4
}


/**
 * returns a cell the in the board there is an empty cell
 * @param board
 * @returns {number[]}
 */
function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * (boardSize-1)+1);
	var j = Math.floor(Math.random() * (boardSize-1)+1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * (boardSize-1)+1);
		j = Math.floor(Math.random() * (boardSize-1)+1);
	}
	return [i, j];
}


/**
 * returns the value of up, down, right, left
 * @returns {number}
 * @constructor
 */
function getKeyPressed() {
	if (keysDown[keyUp]) { //up
		return 1;
	}
	if (keysDown[keyDown]) { //down
		return 2;
	}
	if (keysDown[keyLeft]) { //left
		return 3;
	}
	if (keysDown[keyRight]) { //right
		return 4;
	}
}

/**
 * Draw all the board with pacman, food and walls
 * @param keyPressed
 * @constructor
 */
function draw(keyPressed) {
	var monsterSize = 30;
	var foodSize = 8;
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblName.value =  nameUser;

	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			var center = new Object();
			center.x = i * size + 25;
			center.y = j * size + 25;
			xC = lastVarx;
			yC = lastVary;


			if (board[i][j] == 2) {
				if (keyPressed == 1) { //up
					startA1 = 1.65;
					endA1 = 1.35;
					xC = center.x - 10;
					yC = center.y + 4;
					eyeX = -10;
					eyeY = 4;
				} else if (keyPressed == 2) { //down
					startA1 = 0.65;
					endA1 = 0.35;
					xC = center.x + 10;
					yC = center.y - 4;
					eyeX = 10;
					eyeY = -4;
				} else if (keyPressed == 3) { //left
					startA1 = 1.15;
					endA1 = 0.85;
					xC = center.x - 4;
					yC = center.y - 10;
					eyeX = -4;
					eyeY = -10;
				} else if (keyPressed == 4) { //right
					startA1 = 0.15;
					endA1 = 1.85;
					xC = center.x + 4;
					yC = center.y - 10;
					eyeX = 4;
					eyeY = -10;
				}
				context.beginPath();
				context.arc(center.x, center.y, 17, startA1 * Math.PI, endA1 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(xC, yC, 2.3, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
				lastVarx = xC;
				lastVary = yC;
			} else if (boardMonster[i][j] == 13) {	//monster5
				monster5_img = new Image();
				monster5_img.src = "photos/minion3.png";
				context.drawImage(monster5_img, i * size + 5, j * size + 5, monsterSize +2, monsterSize+2);
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, foodSize, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();

			} else if (board[i][j] == 10) {
				context.beginPath();
				context.arc(center.x, center.y, foodSize, 0, 2 * Math.PI); // circle
				context.fillStyle = color5; //color
				context.fill();

			} else if (board[i][j] == 11) {
				context.beginPath();
				context.arc(center.x, center.y, foodSize+1, 0, 2 * Math.PI); // circle
				context.fillStyle = color15; //color
				context.fill();

			} else if (board[i][j] == 12) {
				context.beginPath();
				context.arc(center.x, center.y, foodSize+2, 0, 2 * Math.PI); // circle
				context.fillStyle = color25; //color
				context.fill();

			} else if (board[i][j] == 4) {
				// wall_image = new Image();
				// wall_image.src = "photos/wall.png";
				// context.drawImage(wall_image, i*60+5, j*60+5, 60, 60);
				// context.beginPath();
				// context.rect(center.x - 30, center.y - 30, size, size);
				// context.fillStyle = "grey"; //color
				// context.fill();
				wall_image = new Image();
				wall_image.src = "photos/wall1.jpg";
				context.drawImage(wall_image, i*size+5, j*size+5, size, size);
			} else if (board[i][j] == 14) {
				specialFood_image = new Image();
				specialFood_image.src = "photos/strawberry.png";
				context.drawImage(specialFood_image, i * size + 5, j * size + 5, monsterSize, monsterSize); //fixme add variable
			}

			drawMonster();
		}
	}
}

/**
 * draw all the monsters
 * @constructor
 */
function drawMonster() {
	lblLife.value = life;
	var monsterSize = 37;
	var tabMonster = 8;

	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			var center = new Object();
			center.x = i * size + 30;
			center.y = j * size + 30;

			if (boardMonster[i][j] == 5) { //monster1
				monster1_image = new Image();
				monster1_image.src = "photos/monster1.png";
				context.drawImage(monster1_image, i * size + tabMonster, j * size + tabMonster, monsterSize , monsterSize);
				// context.drawImage()
			} else if (boardMonster[i][j] == 6) {	//monster2
				monster2_image = new Image();
				monster2_image.src = "photos/monster2.png";
				context.drawImage(monster2_image, i * size + tabMonster, j * size + tabMonster, monsterSize, monsterSize);
			} else if (boardMonster[i][j] == 7) {	//monster3
				monster3_image = new Image();
				monster3_image.src = "photos/monster3.png";
				context.drawImage(monster3_image, i * size + tabMonster, j * size + tabMonster, monsterSize, monsterSize);
			} else if (boardMonster[i][j] == 8) {	//monster4
				monster4_image = new Image();
				monster4_image.src = "photos/monster4.png";
				context.drawImage(monster4_image, i * size + tabMonster, j * size + tabMonster, monsterSize, monsterSize);
			} else if (boardMonster[i][j] == 13) {	//monster5
				monster5_img = new Image();
				monster5_img.src = "photos/minion3.png";
				context.drawImage(monster5_img, i * size + 5, j * size + 5, monsterSize +2, monsterSize+2);
			}
		}
	}
}

$(document).ready(function () {
	$("#signUpForm").validate({
		rules: {
			userName: {
				required: true,
				availableUser: true
			},
			firstName: {
				lettersonly: true,
				required: true
			},
			lastName: {
				lettersonly: true,
				required: true
			},
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				goodPassword: true
			},
			birthday: {
				required: true
			}
		},
		messages: {
			userName: {
				required: 'Required field',
				availableUser: 'UserName already exist'
			},
			firstName: {
				lettersonly: "Must contain only letters",
				required: "Required field"
			},
			lastName: {
				lettersonly: "Must contain only letters",
				required: "Required field"
			},
			email: {
				required: "Required field",
				email: "Please insert valid email"
			},
			password: {
				required: "required field",
				goodPassword: "Password must contain at least 6 characters, include a number and a letter"
			},
			birthday: {
				required: "required field"
			}
		},
		submitHandler: function (form) {
			addUser()
		}
	});
});

$(document).ready(function () {
	$("#signInForm").validate({
		rules: {
			uname: {
				required: true,
				legalUser: true
			},
			psw: {
				required: true,
				legalPass: true
			},
		},
		messages: {
			uname: {
				required: "must be fill",
				legalUser: "User not exist"
			},
			psw: {
				required: "must be fill",
				legalPass: "Password incorrect"
			}
		},
		submitHandler: function (form) {
			loginUser();
		}
	});
});

$(function () {

	//Registration

	//Password must contain at least 6 digit and contain one number and one char.
	$.validator.addMethod('goodPassword', function (value, element) {
		return this.optional(element) ||
			value.length >= 6 &&
			/\d/.test(value) &&
			/[a-z]/i.test(value);
	});

	$.validator.addMethod('availableUser', function (value, element) {
		return localStorage.getItem(value) == null && value !== '';
	});

	$.validator.addMethod('legalUser', function (value, element) {
		if (localStorage.getItem(value) != null) {
			return true;
		}
		else {
			return false;
		}
	});

	$.validator.addMethod('legalPass', function (value, element) {
		let key = document.getElementById("logUserName").value;
		return localStorage.getItem(key) === value;
	});


});



/**
 * this function switch between tabs like  welcome settings signIn game etc
 * @param evt
 * @param tabName
 */
function openTab(evt, tabName) {
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	// evt.currentTarget.className += " active";
}

/**
 * this function save new user on the local host
 */
function addUser() {
	let key = document.getElementById("sigUpForm_UserName").value;
	if (localStorage.getItem(key) == null && key != '') {
		localStorage.setItem(key, document.getElementById("sigUpForm_Password").value);
		openTab(event, 'Sign In')

	} else {
		alert("PLEASE CHOOSE ANOTHER USERNAME");
	}
}

/**
 * this function connect user to the web for play
 */
function loginUser() {
	nameUser = document.getElementById("sigUpForm_UserName").value;
	let key = document.getElementById("logUserName").value;
	if (localStorage.getItem(key) == null) {
	} else {
		let password = document.getElementById("logPass").value;
		if (localStorage.getItem(key) == password) {
			openTab(event, 'startGame')
		} else {
			alert("Please check your password");
		}
	}
}


/**
 * this function close modal dialog with esc key
 */
$(document).keydown(function (event) {
	if (event.keyCode == 27) {

		$('#myModal').modal('hide');
//hide the modal

		$('body').removeClass('modal-open');
//modal-open class is added on body so it has to be removed

		$('.modal-backdrop').remove();
//need to remove div with modal-backdrop class		// openTab(event, 'startGame')
	}
});


/**
 * textbox slider update
 * @param val
 */
function updateTextInputTime(val) {
	document.getElementById('textSliderTime').value = val;
}

/**
 * textbox slider update
 * @param val
 */
function updateTextInputBall(val) {
	document.getElementById('textSliderBall').value = val;
}

function setGameProperties() {
	totalFood = document.getElementById("sliderBalls").value;
	totalTime = document.getElementById("sliderTime").value;
	var inputUp = document.getElementById("setUp").value;
	var inputDown = document.getElementById("setDown").value;
	var inputLeft = document.getElementById("setLeft").value;
	var inputRight = document.getElementById("setRight").value;
	isMonster1 = document.getElementById('myCheckbox1').checked;
	isMonster2 = document.getElementById('myCheckbox2').checked;
	isMonster3 = document.getElementById('myCheckbox3').checked;
	isMonster4 = document.getElementById('myCheckbox4').checked;
	color5 = document.getElementById("regColor").value;
	color15 = document.getElementById("midColor").value;
	color25 = document.getElementById("superColor").value;

	if (inputUp === "ArrowUp" || inputUp === "") {
		keyUp = 38;
	}

	if (inputDown === "ArrowDown" || inputDown === "") {
		keyDown = 40;
	}

	if (inputRight === "ArrowRight" || inputRight === "") {
		keyRight = 39;
	}

	if (inputLeft === "ArrowLeft" || inputLeft === "") {
		keyLeft = 37;
	}
}


function setRandomGameProperties() {
	document.getElementById("sliderBalls").value= getRandomInt(50, 90);
	document.getElementById("textSliderBall").value= document.getElementById("sliderBalls").value;
	document.getElementById("sliderTime").value= getRandomInt(60, 300);
	document.getElementById("textSliderTime").value= document.getElementById("sliderTime").value;
	document.getElementById("myCheckbox1").value= Math.random() >= 0.5;
	if(Math.random() >= 0.5){
		document.getElementById("myCheckbox2").click();
	}
	if(Math.random() >= 0.5){
		document.getElementById("myCheckbox3").click();
	}
	if(Math.random() >= 0.5){
		document.getElementById("myCheckbox4").click();
	}
	document.getElementById("regColor").value=getRandomColor();
	document.getElementById("midColor").value=getRandomColor();
	document.getElementById("superColor").value=getRandomColor();
	document.getElementById("setUp").value="ArrowUp";
	document.getElementById("setDown").value="ArrowDown";
	document.getElementById("setLeft").value="ArrowLeft";
	document.getElementById("setRight").value="ArrowRight";

}



function setDisable() {
    document.getElementById("btnRandom").hidden = true;
    document.getElementById("btnPlay").hidden = true;
    document.getElementById("btnStop").hidden = false;
    document.getElementById("sliderBalls").disabled = true;
    document.getElementById("textSliderBall").disabled= true;
    document.getElementById("sliderTime").disabled= true;
    document.getElementById("textSliderTime").disabled= true;
    document.getElementById("myCheckbox1").disabled= true;
    document.getElementById("myCheckbox2").disabled=true;
    document.getElementById("myCheckbox3").disabled=true;
    document.getElementById("myCheckbox4").disabled=true;
    document.getElementById("setUp").disabled=true;
    document.getElementById("setDown").disabled=true;
    document.getElementById("setLeft").disabled=true;
    document.getElementById("setRight").disabled=true;
    document.getElementById("regColor").disabled=true;
    document.getElementById("midColor").disabled=true;
    document.getElementById("superColor").disabled=true;
    document.getElementById("setUp").disabled=true;
    document.getElementById("setDown").disabled=true;
    document.getElementById("setLeft").disabled=true;
    document.getElementById("setRight").disabled=true;
}



function setAble() {
    document.getElementById("btnRandom").hidden = false;
    document.getElementById("btnPlay").hidden = false;
    document.getElementById("btnStop").hidden = true;
    document.getElementById("sliderBalls").disabled = false;
    document.getElementById("textSliderBall").disabled = false;
    document.getElementById("sliderTime").disabled = false;
    document.getElementById("textSliderTime").disabled = false;
    document.getElementById("myCheckbox1").disabled = false;
    document.getElementById("myCheckbox2").disabled = false;
    document.getElementById("myCheckbox3").disabled = false;
    document.getElementById("myCheckbox4").disabled = false;
    document.getElementById("regColor").disabled = false;
    document.getElementById("midColor").disabled = false;
    document.getElementById("superColor").disabled = false;
    document.getElementById("setUp").disabled = false;
    document.getElementById("setDown").disabled = false;
    document.getElementById("setLeft").disabled = false;
    document.getElementById("setRight").disabled = false;
    document.getElementById("regColor").disabled = false;
    document.getElementById("midColor").disabled = false;
    document.getElementById("superColor").disabled = false;
    document.getElementById("setUp").disabled = false;
    document.getElementById("setDown").disabled = false;
    document.getElementById("setLeft").disabled = false;
    document.getElementById("setRight").disabled = false;
}





function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}


function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


function setUpKey() {
	keyUp = event.keyCode;
}


function setDownKey() {
	keyDown = event.keyCode;
}


function setRightKey() {
	keyRight = event.keyCode;
}


function setLeftKey() {
	keyLeft = event.keyCode;
}




function playMusicGame(){ //todo add!!!!
    document.getElementById('gameSound').play();
    document.getElementById('gameSound').volume = 0.2;

}

function stopMusicGame(){ //todo add!!!!!!
    document.getElementById('gameSound').pause();
    document.getElementById('winSound').pause();

}


function playMusicWin(){
    document.getElementById('winSound').play();
    document.getElementById('winSound').volume = 0.2;
}


function playMusicDeath(){
    document.getElementById('endSound').play();
    document.getElementById('endSound').volume = 0.2;
}

function cleanBoard(){
    for (var i = 0; i < boardSize-1; i++) {
        for (var j = 0; j < boardSize-1; j++) {
            if ((board[i][j] !=4) || boardMonster[i][j]!=4){
                board[i][j] = 0;
                boardMonster[i][j] = 0;
            }
        }
    }
}

//
// function displayUserName(){
//     var userName = document.getElementById('sigUpForm_UserName');
//     changePage()
// }

// window.onresize = function () {
// 	canvas.style.width = '100%';
// 	canvas.height = canvas.width * .75;
// }



function pressSU() {
	document.getElementById("pressSU").click();
}


function pressSI() {
	document.getElementById("pressSI").click();
}


function stopGame(){
	cleanBoard();
	stopMusicGame();
	setAble();
}
