
// Constants
const winningMsgs = {
    'P': 'Player Wins!',
    'D': 'Dealer Wins!',
    'PB': 'Player Has Blackjack!',
    'DB': 'Dealer Has Blackjack!',
    'T': "It's a Tie"
};


//Variables
let shuffledDeck, bankroll, bet, playerHand, playerScore, dealerHand, dealerScore, choice, winner;

//Beginning Game Initialization
function init() {
    bankroll = 1000;
    bet = 0;
    winner = null;
    playerHand = [];
    dealerHand = [];
    render();
}

function dealCards() {
    winner = null;
    playerHand = [];
    dealerHand = [];
    shuffleDeck();
    for(let i = 0; i  < 2; i++) {
        playerHand.push(shuffledDeck.shift());
        dealerHand.push(shuffledDeck.shift());
    }
    playerScore = computeHand(playerHand);
    dealerScore = computeHand(dealerHand);
    if (playerScore === 21 && dealerScore === 21) {
        winner = 'T';
    } else if (playerScore === 21) {
        winner = 'PB';
    } else if (dealerScore === 21) {
        winner = 'DB';
    }
    render();
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

//Render Function
function render() {
    //Card Render
    $('#dealerHand').html("");
    $('#playerHand').html("");
    playerHand.forEach((card) => {
        let cardInHand = `<div class="card ${card.face}"></div>`;
        $('#playerHand').append(cardInHand);
    });
    dealerHand.forEach((card, index) => {
        let cardInHand = `<div class="card ${index === 1 && !winner ? 'back' : card.face}"></div>`;
        $('#dealerHand').append(cardInHand);
    });
    if (winner) {
        $('#messageBox').html(winningMsgs[winner]);
    } else if (!winner && playerHand.length) {
        $('#messageBox').html(`Player has ${computeHand(playerHand)}`);
    } else {
        $('#messageBox').html('Place your Bet');
    }
    !winner && playerHand.length ? $('#hit-stay-btns').show() : $('#hit-stay-btns').hide();
    !winner && playerHand.length || !bet ? $('#placeBet').hide() : $('#placeBet').show();
    $('#chips').css('pointer-events', !winner && playerHand.length ? 'none' : 'all');
    $('#bankroll').html(`${bankroll}`);
    $('#currentBet').html(`Current bet: $${bet}`)

}

//Calculate Hand score
function computeHand(hand) {
    let score = 0;
    let aces = 0;
    hand.forEach(function (card) {
        score += card.value;
        if(card.value === 11) aces++;
    });
    while(score > 21 && aces) {
        score -= 10;
        aces--;
    }
    return score;
}

function hitCard() {
    playerHand.push(shuffledDeck.shift());
    if(computeHand(playerHand) > 21) {
        winner = 'D';
    } else if (computeHand(playerHand) === 21) {
        winner = 'PB';
    }
    render();
}

function stay() {
    while(computeHand(dealerHand) < 17 && !winner) {
        dealerHand.push(shuffledDeck.shift());
    }
    playerScore = computeHand(playerHand);
    dealerScore = computeHand(dealerHand);
    if (dealerScore > 21) {
        winner = 'P';
    } else if (dealerScore === 21) {
        winnner = 'DB';
    } else if (playerScore === dealerScore) {
        winner = 'T';
    } else if (playerScore > dealerScore) {
        winner = 'P';
    } else {
        winner = 'D';
    }
    render();
}


init();

//Event Listeners
$('#chips').on('click', 'input', (e) => {
    bet += parseInt(($(e.target).val()).substring(1));
    bankroll -= parseInt(($(e.target).val()).substring(1));
    render();
    $('#placeBet').show();
    $('#bank').on('click', 'button', (e) => {
        dealCards();
    })
});



$('#hit-stay-btns').on('click', 'button', (e) => {
    if($(e.target).attr('id') === "hit") {
        hitCard();
    } else if($(e.target).attr('id') === "stay") {
        stay();
    }
});

