console.log("linked up");

let shuffledDeck, bankroll, bet, playerHand, dealerHand, handInProgress;


function init() {
    bankroll = 1000;
    bet = 0;
    playerHand = [];
    dealerHand = [];
    handInProgress = false;
    render();
}

function render() {
    // if(!handInProgress) {
    // } else if(handInProgress) {
    //     dealCards();
    // }
}

function dealCards() {
    handInProgress = true;
    shuffleDeck();
    playerHand.push(shuffledDeck.shift());
    dealerHand.push(shuffledDeck.shift());
    playerHand.push(shuffledDeck.shift());
    dealerHand.push(shuffledDeck.shift());
}

//Fisher-Yates Method for shuffling
function shuffleDeck() {
    shuffledDeck = deck.slice();
    for (let i = shuffledDeck.length-1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i+1));
        var itemAtIndex = shuffledDeck[randomIndex];

        shuffledDeck[randomIndex] = shuffledDeck[i];
        shuffledDeck[i] = itemAtIndex;
    }
    return shuffledDeck;
}

function placeBet() {
    const minBet = 1;
    if (bet > minBet || bet < 0 || bet.match(/[a-z]/i)) {
        console.log(`Bet must be numerical value between 1 and ${bankroll}.`);
    }
}

init();

//Event Listeners
$('#betSbmt').on('click', () => {
    bet = $('bet').val();
    placeBet();
});
