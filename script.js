let xp = 0;
let health = 100;
let currentWeapon = 0;
let gold = 50;
let fighting;
let monsterHealth;
let inventory = ['stick']; // ; Indicates end of line.

const button1 = document.querySelector('#button1');  // The bracket contains the id of the element.
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const text = document.querySelector('#text');
const xpText = document.querySelector('#xpText');
const healthText = document.querySelector('#healthText');
const goldText = document.querySelector('#goldText');
const monsterStats = document.querySelector('#monsterStats');
const monsterNameText = document.querySelector('#monsterName');
const monsterHealthText = document.querySelector('#monsterHealth');
const weapons = [
  {
    name: 'stick',
    power: 5
  },
  {
    name: 'dagger',
    power: 30
  },
  {
    name: 'claw hammer',
    power: 50
  },
  {
    name: 'sword',
    power: 100
  }
]

const locations = [
  {
    name: 'town square',
    'button text': ["Go to store", "Go to cave", "Fight dragon"],
    'button function': [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says \"Store.\"'
  },
  {
    name: 'store',
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button function": [buyHealth, buyWeapon, goTown],
    text: "You have entered the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button function": [fightSlime, fightBeast, goTown],
    text: "You have entered the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button function": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "buttontext": ["Go to town square", "Go to town square", "Go to town square"],
    "button function": [goTown, goTown, easterEgg],
    text: "The monster screams 'Arg!' as it dies. You gain experience points and find gold."
  },
  {
    name:"lose",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button function": [restart, restart, restart],
     text: "You die."
  },
  {
    name: "win",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button function": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME!"  
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button function": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
]
const monsters = [
  {
    name: 'slime',
    level: 2,
    health: 15
  },
  {
    name: 'fanged beast',
    level: 8,
    health: 60
  },
  {
    name: 'dragon',
    level: 20,
    health: 300
  }
]

/* This is 
multiple line comment 
*/
// Initializing the buttons.


button1.onclick = goStore;  // when we click , the goStore function is called.
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];

  button1.onclick = location["button function"][0];
  button2.onclick = location["button function"][1];
  button3.onclick = location["button function"][2];  // These are the functions again.
  text.innerText = location.text;
}

// We created this update function to avoid writing it repeatedly .Its just like python's for loop.  

function goStore() {
  update(locations[1]);
}

function goTown() {
  update(locations[0]);
}


function goCave() {
  update(locations[2]);
}


function buyHealth() {
  if (gold >= 10) {
    gold -= 10
    health += 10
    goldText.innerText = gold
    healthText.innerText = health
  } else {
    text.innerText = "You do not have enough gold to buy health."
  }

}

function buyWeapon(weapons) {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a" + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += "In your inventory you have:" + inventory;
    } else {
      text.innerText = "You don't have enough gold to buy a weapon."
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onClick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift(); //This is extracting the first element from the array.
    text.innerText = "You sold a" + currentWeapon;
  }else {
    text.innerText = "Don't sell your only weapon!";
  }

}

function gofight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";  // Here we are using the style property to display the monster stats. Basically using javascipt to style the html and change css display properties.
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The" + monsters[fighting].name + "attacks.";
  text.innerText += "You attack it with your" + weapons[currentWeapon].name + ".";
  if (isMonsterhit() || health < 20){    // || is 'or' and && is 'and'.
    health -= getMonsterAttackValue(monsters[fighting].level);
  }else {
    text.innerText += "You miss.";
  }
  monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;   // Math.floor() rounds down the number while Math.random() gives a random number between 0 and xp of that player.
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();  //check the commented one for full version.
    }
  if (Math.random() <= .1 && inventory.length == 1){  // && is 'and' in js.
    text.innerText += "Your" + inventory.pop() + "breaks.";
    currentWeapon --;
  }
  }

/* if (fighting === 2){
      winGame();
    }else {
      defeatMonster();
    } */
function isMonsterhit() {
  return Math.random() > .2; 
}

function winGame() {
  update(locations[5]);
}

function getMonsterAttackValue(level) {
let hit = (level * 5) - (Math.floor(Math.random() * xp));
console.log(hit);
return hit;
  
}
  function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = "gold";
    xpText.innerText = xp;
    update(locations[5]);
  }

  function dodge() {
    text.innerText = "You dodge the attack from the" + monsters[fighting].name + ".";
  }


  function lose() {
    update(locations[5]);
  }

  function fightSlime() {
    fighting = 0;
    gofight();

  }

  function fightDragon() {
    fighting = 1;
    gofight();
  }

  function fightBeast() {
    fighting = 2;
    gofight();
  }
 function restart() {
   xp = 0;
   health = 100;
   gold = 50;
   currentWeapon = 0;
   inventory = ['stick'];
   goldText.innerText = gold;
   healthText.innerText = health;
   xpText.innerText = xp;
   goTown();
 }

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}
function pickEight() {
  pick(8);
}

// Creating pick function
function pick(guess) {
  let numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.indexOf(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  }else {
    text.innerText = "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0){
    lose()
    }
  }
}























