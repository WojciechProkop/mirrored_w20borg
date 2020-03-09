
//scripts.js

const deck = document.querySelectorAll(".memCard");
let prevCard = null;
let flips = 0;
const disasterDeck = [];

//for move counter
let moves = 0;
let counter = document.querySelector(".moves");
let blocked = false; // If false, user can flip. If true, user is locked out from playing
randomize();

//initialize timer
var sec = 0, min = 0;
var finalTime;
document.getElementById("timer").innerHTML = "0:00";

//initialize disaster counter
let disasterCount = 0;
document.getElementById("disasters").innerHTML = "" + disasterCount;

//count matches
var matches = 0;
let gameover = false;

// associate reset() with html button id="reset"
document.getElementById("reset").onclick = reset;

function flipCard()
{
    if(blocked)return;

    //timer start on first move
    if (moves === 0){
        startTimer();
    }
    moves++;
    //end of timer
    flips += 1;
    this.classList.toggle('flip');

    if (this.dataset.name   === "fire" ){
        disasterDeck.push(this.dataset.name);
        console.log(disasterDeck);
        this.classList.toggle('flip');
        this.removeEventListener('click', flipCard);
        disasterCount ++;
        disasterCounter(disasterCount);

    }

    if (disasterDeck.length > 0 && this.dataset.name   === "water" && flips === 1){
        let i;
        for (i = 0; i < disasterDeck.length; i++){
            if (disasterDeck[i] === 'fire'){
                this.classList.toggle('flip');
                this.removeEventListener('click', flipCard);
                disasterCount --;
                disasterCounter(disasterCount);
                disasterDeck.pop();
                console.log(disasterDeck);
                matches++;
                flips = 2;
                if (matches === 6){
                    console.log('Victory')
                    gameover = true;
                    finalTime = document.getElementById("timer").innerHTML;
                    victory(finalTime);
                    //document.getElementById("finTime").innerHTML = finalTime;
                }
            }
        }
    }

    if (disasterCount > 1){
        console.log('Defeat')
        gameover = true;
        defeat(disasterCount);
    }

    // If this is not the first click
    if(prevCard != null)
    {   // If the this card and the previous card share the same name remove the event
        // listener functionality, disabling the card face up.
        if(this.dataset.name === prevCard.dataset.name && prevCard != this)
        {
            this.removeEventListener('click', flipCard);
            prevCard.removeEventListener('click', flipCard);
            console.log("removed listeners");
            matches++;
            prevCard = null
            flips = 0;


            //IF ALL MATCHED
            if (matches === 6){
                console.log('Victory')
                gameover = true;
                finalTime = document.getElementById("timer").innerHTML;
                victory(finalTime);
                //document.getElementById("finTime").innerHTML = finalTime;
            }

        }
    }

    console.log(flips);
    // If you flipped two cards with no match, then flip them back down.
    if(flips >= 2)
    {
        blocked = true;
        // Without this delay, last card "flipped" flips back too fast to
        // be seen.
        if(prevCard != this)
        {
            setTimeout(() =>{
                this.classList.toggle('flip');
                prevCard.classList.toggle('flip');
                prevCard = null;
                blocked = false;
            }, 1500);
        }
        setTimeout(()=>{
            blocked = false;
            flips = 0;
            prevCard = null;
        }, 1500);

    }
    else {prevCard = this}
}

// Shuffle the board
function randomize()
{
    deck.forEach(c => {
        let ranPos = Math.floor(Math.random() * 12);
        c.style.order = ranPos;
    })
}

// Add eventListener events to every card during initialization, and call flipCard() when clicked.
deck.forEach(c =>c.addEventListener('click', flipCard));

//Count the Players moves
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        sec = 0;
        min = 0;
        startTimer(); //insert timer here
    }
}

//Counts the Number of disasters
function disasterCounter(disasterCount) {
    document.getElementById("disasters").innerHTML = "" + disasterCount;

}

const nameList = [
    'Time', 'Past', 'Future', 'Dev',
    'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling',
    'Fall', 'Jump', 'Cliff', 'Mountain', 'Rend', 'Red', 'Blue',
    'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat',
    'Kitty', 'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit',
    'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper', 'Deepest',
    'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video',
    'Game', 'Donkey', 'Mule', 'Colt', 'Cult', 'Cultist', 'Magnum',
    'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code',
    'Script', 'Writer', 'Near', 'Close', 'Open', 'Cube', 'Circle',
    'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha',
    'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King',
    'Duke', 'Rest', 'Fire', 'Flame', 'Morrow', 'Break', 'Breaker', 'Numb',
    'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Rooster',
    'Sand', 'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big',
    'Small', 'Short', 'Tall', 'Sith', 'Bounty', 'Hunter', 'Cracked', 'Broken',
    'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies',
    'Lie', 'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Walker',
    'Zombie', 'Sarge', 'Capt', 'Captain', 'Punch', 'One', 'Two', 'Uno', 'Slice',
    'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound',
    'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich', 'Smasher', 'Extreme', 'Multi',
    'Universe', 'Ultimate', 'Death', 'Ready', 'Monkey', 'Elevator', 'Wrench', 'Grease', 'Head', 'Theme',
    'Grand', 'Cool', 'Kid', 'Boy', 'Girl', 'Vortex', 'Paradox'
];

let finalName = "";


function generate(){
    document.getElementById("nameplace").innerHTML = randName();
}

function randName(){
    finalName = nameList[Math.floor( Math.random() * nameList.length )];
    finalName += nameList[Math.floor( Math.random() * nameList.length )];
    if ( Math.random() > 0.5 ) {
        finalName += nameList[Math.floor( Math.random() * nameList.length )];
    }
    return finalName;
};




//timer
function startTimer()
{
    var Countup = setInterval(function(){
        ++sec;
        //document.getElementById("matches").innerHTML = "matches: "+matches;
        document.getElementById("timer").innerHTML = ""+min+" : "+sec;
        //if all cards match
        if (sec == 59){
            min++;
            sec = -1;
        }
        if (gameover == true){
            document.getElementById("timer").innerHTML = finalTime;
        }
    },1000)
}

// resets the game board
function reset() {
    //if (flips > 0) return; // doesn't quite fix a mid-flip reset

    // block while reseting
    blocked = true;
    flips = 0;
    prevCard = null;
    blocked = false;

    // flips all cards facedown
    deck.forEach(c => c.classList.toggle('flip', false));

    // reapply event listener to disabled (or all) cards
    deck.forEach(c => c.addEventListener('click', flipCard));

    // randomize again, but delayed so that cards can flip first
    setTimeout(randomize, 500);

    blocked = false;

    //restart time and moves
    moves = 0;
    sec = 0;
    min = 0;
    //document.getElementById("timer").innerHTML = "time: 0 min 0 sec";
    clearInterval(Countup);
}

function victory(finalTime) {
    let newWin = window.open("Victory.html", "Victory", "width=400,height=400");
    newWin.document.getElementById("score").innerHTML = "finalTime";

}

function defeat(disasterCount) {
    let newWin = window.open("defeat.html", "Defeat", "width=400,height=400");
    newWin.document.getElementById("disastercount").innerHTML = '5';

}



