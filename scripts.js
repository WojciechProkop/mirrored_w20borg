
//scripts.js


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }


mySound = new sound("240776__f4ngy__card-flip.wav");
const deck = document.querySelectorAll(".memCard");
let prevCard = null;
let flips = 0;
function flipCard()
{
    mySound.play();
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




