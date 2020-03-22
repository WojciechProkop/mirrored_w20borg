function close_window() {
    if (confirm("Ready to close the tutorial window and Start the game?")) {
        close();
    }
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
    'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code',
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




function acceptname() {
    // Once the user accepts the username save it in the file
    let userName = document.getElementById("nameplace").innerHTML;

    document.getElementById("username").innerHTML = document.getElementById("nameplace").innerHTML;
    document.getElementById('user-button').disabled = true;
    document.getElementById('gen-button').disabled = true;

    const storage = require('electron-json-storage');
    storage.set('Username', { mode: 'playermode', score:'score' }, function(error) {
        if (error) throw error;
    });


    if(document.getElementById('single').checked){
        // Store the username in the console with a score of zero
        storage.set(userName, { mode: 'single', score:null }, function(error) {
            if (error) throw error;
        });
    }
    if(document.getElementById('multi').checked){
        // Store the username in the console with a score of zero
        storage.set(userName, { mode: 'multi', score:null }, function(error) {
            if (error) throw error;
        });
    }

    storage.getAll(function(error, data) {
        if (error) throw error;

        console.log(data);
    });

}


function saveScore() {
    const query = location.search.substring(1);
    const keyValues = query.split(/&/);
    const keyValuePairs = keyValues[0].split(/=/);
    const valuepairs = keyValuePairs[1].split(/%/);
    let value = valuepairs[2];

    document.getElementById("score").innerHTML = value;


// Once the user accepts the username save it in the file
    const storage = require('electron-json-storage');

    storage.keys(function(error, keys) {
        if (error) throw error;

        for (let key of keys) {
            //console.log('There is a key called: ' + key);
            storage.get(key, function(error, data) {
                if (error) throw error;

                //console.log(data);
                if(data.score == null){
                    let gmmode = data.mode;
                    storage.remove(key, function(error) {
                        if (error) throw error;
                    });
                    storage.set(key, { mode: gmmode, score:value }, function(error) {
                        if (error) throw error;
                    });
                }
            });
        }
    });

    storage.getAll(function(error, data) {
        if (error) throw error;
        //console.log(data);
    });
}

function singleScoreBoard(){

    const storage = require('electron-json-storage');
    let scoreboard = {};
    const scoreKeys = new Array();
    const scoreData = new Array();


    storage.keys(function(error, keys) {
        if (error) throw error;

        for (let key of keys) {
            storage.get(key, function(error, data) {
                if (error) throw error;
                if (data.mode != 'multi'){
                    scoreboard[key] = data;
                }
                scoreKeys.push(key);
                scoreData.push(data);

                scoreboardSorted(scoreboard);

            });
        }
    });
    console.log(scoreboard);
}

function multiScoreBoard(){

    const storage = require('electron-json-storage');
    let scoreboard = {};
    const scoreKeys = new Array();
    const scoreData = new Array();


    storage.keys(function(error, keys) {
        if (error) throw error;

        for (let key of keys) {
            storage.get(key, function(error, data) {
                if (error) throw error;
                if (data.mode == 'multi'){
                    scoreboard[key] = data;
                }
                scoreKeys.push(key);
                scoreData.push(data);

                multiscoreboardSorted(scoreboard);

            });
        }
    });
    console.log(scoreboard);
}


function scoreboardSorted(scoreboard){

    // Sort the dictionary to get the fastest time
    function orderBySubKey( input, key ) {
        return Object.keys( input ).map( key => ({ key, value: input[key] }) ).sort( (a, b) => a.value[key] - b.value[key] );
    }

    // Take top 5 people for score board
    let scoreArray = orderBySubKey( scoreboard, 'score' ).slice(0, 5);
    let myJSON = '';
    for (i = 0; i < scoreArray.length; i++){
        myJSON += JSON.stringify(scoreArray[i].key);
        myJSON += JSON.stringify(scoreArray[i].value.score);
        myJSON += '<br>';
    }

    document.getElementById("single-player-score").innerHTML = myJSON;
}

function multiscoreboardSorted(scoreboard){

    // Sort the dictionary to get the fastest time
    function orderBySubKey( input, key ) {
        return Object.keys( input ).map( key => ({ key, value: input[key] }) ).sort( (a, b) => a.value[key] - b.value[key] );
    }

    // Take top 5 people for score board
    let scoreArray = orderBySubKey( scoreboard, 'score' ).slice(0, 5);
    let myJSON = '';
    for (i = 0; i < scoreArray.length; i++){
        myJSON += JSON.stringify(scoreArray[i].key);
        myJSON += JSON.stringify(scoreArray[i].value.score);
        myJSON += '<br>';
    }

    document.getElementById("multi-player-score").innerHTML = myJSON;
}
