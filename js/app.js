let openCards = [];
let moveCount = 0;
let matchedPairs = 0;
let point = 3.0;
let interval;
let time;
/*
 * Create a list that holds all of your cards
 */
let cards = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", 
             "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];
cards = cards.concat(cards);
const deck = document.getElementsByClassName("deck").item(0);
const restart = document.getElementsByClassName("restart").item(0);
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCard() {
	cards = shuffle(cards);
	const fragment = document.createDocumentFragment();
	for (let tmp of cards) {
    	const newLi = document.createElement('li');
    	newLi.className = 'card';
    	const newIBack = document.createElement('i');
    	newIBack.className = 'card back';
    	const newIShow = document.createElement('i');
    	newIShow.className = 'card show';
    	const newI = document.createElement('i');
    	newI.className = tmp;
    	newIShow.appendChild(newI);
    	newLi.appendChild(newIShow);
    	newLi.appendChild(newIBack);
    	fragment.appendChild(newLi);
    }
    while (deck.lastElementChild) {
    	deck.removeChild(deck.lastElementChild);
    }
    deck.appendChild(fragment);
}

// Shuffle function from http://stackoverflow.com/a/2450976
/**
* @shuffle array elements
* @param {array} array
*/
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
* @timer
*/
let timer = document.getElementsByClassName('timer')[0];
function countTime() {
	timer.innerHTML = (Date.now() - time) / 1000;
}
/**
* @increase move counts, and decrease the star point
*/
function increaseMove() {
	moveCount++;
	document.getElementsByClassName('moves')[0].textContent = moveCount;
  
	if (moveCount === 16) {
		appendHalfStar('third-star');
		point = 2.5;
	} else if (moveCount === 20) {
		appendOStar('third-star');
		point = 2.0;
	} else if (moveCount === 25) {
		appendHalfStar('second-star');
		point = 1.5;
	} else if (moveCount === 30) {
		appendOStar('second-star');
		point = 1.0;
	} 
}

function appendHalfStar(index) {
	document.getElementById(index).className = 'fa fa-star-half-empty';
}

function appendOStar(index) {
	document.getElementById(index).className = 'fa fa-star-o';
}

/**
* @open card
* @param {Event.target} clickedCard
*/
function openCard(clickedCard) {
	clickedCard.parentElement.classList.add('open');
}

/**
* @add card to openCards array, if the list already has another car, check matching
* @param {Event.target} clickedCard
*/
function addCardList(clickedCard) {
	if (openCards.length === 0) {
		openCards.push(clickedCard.previousSibling);
	} else {
		checkMatch(clickedCard);
	}
}
/**
* @check cards match, if matched, keep cards open; if not matched, hide cards.
* @param {Event.target} second clickedCard
*/
function checkMatch(clickedCard) {
	const first = openCards[0];
	const second = clickedCard.previousSibling;
	console.log(first);
	console.log(second);
	if (first.firstElementChild.className === second.firstElementChild.className) {
		setTimeout(matchCards, 500, first, second);
		openCards = [];
	} else {
		openCards.push(second);
		setTimeout(hideCards, 500, openCards);
		openCards = [];
	}
}

/**
* @hide cards
* @array array of cards that need to hide
*/
function hideCards(array) {
	for (let tmp of array) {
		tmp.parentElement.classList.remove('open');
	}
}

/**
* @set matched two cards to card match class
* @first {Element} first card
* @second {Element} second card
*/
function matchCards(first, second) {
	first.classList.remove('open', 'show');
	first.classList.add('match');
	second.classList.remove('open', 'show');
	second.classList.add('match');
	matchedPairs++;
	if (matchedPairs === 8) {
	    gameFinish();	
	}
}

const popUp = document.getElementsByClassName('pop-up').item(0);
function gameFinish() {
	const gameTime = (Date.now() - time) / 1000;
	// setTimeout(alert, 500, "congratuation, your game time is " + gameTime + " seconds and get " + point + " stars");
	document.getElementsByClassName('pop-up-text').item(0).innerHTML = "congratuation, your game time is " + gameTime + " seconds and get " + point + " stars";
	document.getElementsByClassName('pop-up-button').item(0).addEventListener('click', backToGame);
	popUp.style.display = "block";
}

function backToGame() {
	refresh();
    popUp.style.display = "none";
}

function refresh() {
    clearInterval(interval);
	interval = null;
	point = 3.0;
	moveCount = 0;
	timer.innerHTML = '0.0';
	matchedPairs = 0;
	document.getElementsByClassName('moves')[0].textContent = moveCount;
	document.getElementById('first-star').className = 'fa fa-star';
    document.getElementById('second-star').className = 'fa fa-star';
	document.getElementById('third-star').className = 'fa fa-star';
	displayCard();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 function clickCard(evt) {
 	if (!interval) {
 		start = true;
 		time = Date.now();
 		interval = setInterval(countTime, 10);
 	}
 	const clickedCard = evt.target;
 	openCard(clickedCard);
 	addCardList(clickedCard);
 	increaseMove();
 }
displayCard();
deck.addEventListener('click', clickCard);
restart.addEventListener('click', refresh);