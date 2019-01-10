
// Constants
const winningMsgs = {
    'P': 'Player Wins!',
    'D': 'Dealer Wins!',
    'PB': 'Player Has Blackjack!',
    'DB': 'Dealer Has Blackjack!',
    'T': "It's a Tie"
};

const audio = {
    ambience: new Audio('resources/audio/ambience_casino-stephan_schutze-1391090820.mp3'),
    shuffle: new Audio('resources/audio/cards_shuffling-soundbible.com-565963092.mp3'),
    chips: new Audio('resources/audio/poker-chips-daniel_simon.mp3'),
    applause: new Audio('resources/audio/small_crowd_applause-yannick_lemieux-1268806408.mp3'),
    boo: new Audio('resources/audio/Crowd Boo 1-SoundBible.com-437793776.mp3')
}

//Variables
let shuffledDeck, bankroll, bet, playerHand, playerScore, dealerHand, dealerScore, winner, currentBet;

//Beginning Game Initialization
function init() {
    bankroll = 1000;
    bet = 0;
    winner = null;
    playerHand = [];
    dealerHand = [];
    render();
}

//Deal first two cards
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
        payOut();
    } else if (playerScore === 21) {
        winner = 'PB';
        payOut();
        audio.applause.play();
    } else if (dealerScore === 21) {
        winner = 'DB';
        audio.boo.play();
    }
    audio.shuffle.play();
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
    //Stages of play Rendering
    if (winner) {
        $('#messageBox').html(winningMsgs[winner]);
        $('#dealer-display').html(`Dealer has ${computeHand(dealerHand)}`)
            if(currentBet > bankroll) {
                $('#messageBox').html(`${winningMsgs[winner]}<br>Max Bet!`);
            }
    } else if (!winner && playerHand.length) {
        $('#player-display').html(`Player has ${computeHand(playerHand)}`);
        $('#dealer-display').html(`Dealer is showing ${dealerHand[0].value}`);
        $('#messageBox').html(`Hit or stay?`);
    } else {
        $('#messageBox').html('Place your Bet');
        if(currentBet > bankroll) {
            $('#messageBox').html('Max Bet');
        }
    }
    //Button Visibility/Functionality Switches
    !winner && playerHand.length ? $('#hit-stay-btns').show() : $('#hit-stay-btns').hide();
    !winner && playerHand.length || !bet ? $('#place-bet').hide() : $('#place-bet').show();
    (winner === 'D' || winner === 'DB') && !bankroll && !bet ? $('#new-game-btn').show() : $('#new-game-btn').hide();
    $('#chips').css('pointer-events', !winner && playerHand.length ? 'none' : 'all');
    //Bank Bet Display
    $('#bankroll').html(`${bankroll}`);
    $('#current-bet').html(`Current bet: $${bet}`)
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

//Hit Card
function hitCard() {
    playerHand.push(shuffledDeck.shift());
    if(computeHand(playerHand) > 21) {
        winner = 'D';
        audio.boo.play();
        payOut();
    } 
    render();
}

//Stay hand
function stay() {
    while(computeHand(dealerHand) < 17 && !winner) {
        dealerHand.push(shuffledDeck.shift());
    }
    playerScore = computeHand(playerHand);
    dealerScore = computeHand(dealerHand);
    if (dealerScore > 21) {
        winner = 'P';
        audio.applause.play();
    } else if (playerScore === dealerScore) {
        winner = 'T';
    } else if (playerScore > dealerScore) {
        winner = 'P';
        audio.applause.play();
    } else {
        winner = 'D';
        audio.boo.play();
    }
    payOut();
    render();
}

//Payout
function payOut() {
    if (winner === 'P') {
        bankroll += 2 * bet;
    } else if (winner === 'PB') {
        bankroll += bet + (bet * 1.5);
    } else if (winner === 'T') {
        bankroll += bet;
    }
    bet = 0;
}


init();

//Event Listeners
$('#chips').on('click', 'input', (e) => {
    audio.chips.play();
    currentBet = parseInt(($(e.target).val()).substring(1))
    if(currentBet <= bankroll) {
        bet += currentBet;
        bankroll -= currentBet;
    }
    render();
    $('#place-bet').show();
});

$('#bank').on('click', 'button', (e) => {
    if (!bet) return;
    dealCards();
});

$('#hit-stay-btns').on('click', 'button', (e) => {
    if($(e.target).attr('id') === "hit") {
        hitCard();
    } else if($(e.target).attr('id') === "stay") {
        stay();
    }
});

$('#new-game-btn').on('click', 'button', (e) => {
    if($(e.target).attr('id') === "new-game") init();
});