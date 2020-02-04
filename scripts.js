
//scripts.js

const deck = document.querySelectorAll(".memCard");
let prevCard = null;
let flips = 0;
function flipCard()
{
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
            prevCard = null
            flips = 0;
        }
    }

    console.log(flips);
    // If you flipped two cards with no match, then flip them back down.
    if(flips >= 2)
    {
        // Without this delay, last card "flipped" flips back too fast to 
        // be seen.
        setTimeout(() =>{
        this.classList.toggle('flip');
        prevCard.classList.toggle('flip');
        prevCard = null;
        flips = 0;
    }, 1500);

    }
    else {prevCard = this}
}
// Add eventListener events to every card during initialization, and call flipCard() when clicked.
deck.forEach(c =>c.addEventListener('click', flipCard));






