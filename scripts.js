
//scripts.js

const deck = document.querySelectorAll(".memCard");
let prevCard = null;
let flips = 0;
let blocked = false; // If false, user can flip. If true, user is locked out from playing
randomize();

//count matches
let matchesMade = 0;
//account for first flip
let numMoves = 0;


function flipCard()
{
    if(blocked)return;
    //starts timer on first flip
    if (numMoves === 0){
        startTimer();
    };
    numMoves++;
    flips += 1;
    this.classList.toggle('flip');
    // If this is not the first click
    if(prevCard != null)
    {   // If the this card and the previous card share the same name remove the event
        // listener functionality, disabling the card face up. 
        if(this.dataset.name === prevCard.dataset.name && prevCard != this)
        {
            this.removeEventListener('click', flipCard);
            prevCard.removeEventListener('click', flipCard);
            console.log("removed listeners");
            matchesMade++;
            prevCard = null
            flips = 0;
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

//timer
function startTimer()
{
    var sec = 0, min = 0;
    var Countup = setInterval(function(){
        ++sec;
        document.getElementById("timer").innerHTML = min+" min "+sec+" sec";
        //if all cards match
        if (sec == 60){
            min++;
            sec = 0;
        }
    },1000)
}

// Add eventListener events to every card during initialization, and call flipCard() when clicked.
deck.forEach(c =>c.addEventListener('click', flipCard));
