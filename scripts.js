
//scripts.js

//Find all .memCard objects
const cards = document.querySelectorAll(".memCard");

function flipCard()
{
    this.classList.toggle('flip');
}

console.log(cards[0]);// comes up as undefined, even though it should find
                      // the memory cards. You have to use the electron
                      // terminal to see the output.
                      // Visual Studio Code doesn't print anything


// for some reason cards is empty, so forEach never executes
cards.forEach(c => c.addEventListener('click', flipCard));


