let fightingState = false;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Player {
  constructor(name, hp, mp, level, expcap, exp) {
    this.name = name;
    this.hp = hp;
    this.mp = mp;
    this.level = level;
    this.expcap = expcap;
    this.exp = exp;
  }

  levelup() {
    this.level += 1;
    this.hp += 100;
    this.mp += 100;
    this.expcap += 100 + this.expcap * 0.5;
    this.exp = 0;
    timeStamp = getTimeStamp();
    appendNamelessMessage(
      timeStamp,
      "The stone crackles... and a strange robotic voice bursts from nowhere: \nCongratulations on leveling up!"
    );
    appendNamelessMessage(
      timeStamp,
      `Your current level is ${this.level}. You have ${this.hp} health points and ${this.mp} mana points!`
    );
    appendNamelessMessage(timeStamp, "You feel a bit stronger than before...");
    appendNamelessMessage(
      timeStamp,
      `Congratulations, ${this.name}, you have been promoted to a new rank!`
    );
  }
}

class Monster {
  constructor(name, hp) {
    this.name = name;
    this.hp = hp;
  }
}

async function fightingRounds(player, rounds) {
  timeStamp = getTimeStamp();
  fightingState = true;
  appendNamelessMessage(
    timeStamp,
    `\nAdventure begins, starting round ${
      i + 1
    }... (Press \` key on keyboard to scroll to bottom of chat.)`
  );

  // Generate a monster
  let monsterName = `Monster_Lv_${player.level}`;
  let monsterHP = player.hp + 10; // Example monster HP scaling
  let monster = new Monster(monsterName, monsterHP);
  await sleep(Math.floor(Math.random() * 10000) + 3000);
  appendNamelessMessage(
    timeStamp,
    `A wild ${monster.name} appears with ${monster.hp} HP!`
  );

  // Battle begins
  let fullHP = monster.hp;
  let fighting = true;

  while (fighting) {
    let damage = Math.floor(
      Math.random() * (player.level + player.hp * 0.5 + 10)
    );

    // Monster takes damage
    monster.hp = Math.max(monster.hp - damage, 0); // Ensure HP doesn't go negative
    let percentageHealth = Math.floor((monster.hp / fullHP) * 50);

    await sleep(Math.floor(Math.random() * 10000) + 3000);
    appendNamelessMessage(
      timeStamp,
      `${monster.name} HP: ${"█".repeat(percentageHealth).padEnd(50, " ")} | ${
        monster.hp
      }/${fullHP}`
    );

    if (damage > (player.level + player.hp * 0.5 + 10) * 1.5) {
      await sleep(Math.floor(Math.random() * 10000) + 3000);
      appendNamelessMessage(
        timeStamp,
        `CRITICAL STRIKE!!! You dealt ${damage} DAMAGE to ${monster.name}!`
      );
    } else {
      await sleep(Math.floor(Math.random() * 10000) + 3000);
      appendNamelessMessage(
        timeStamp,
        `You dealt ${damage} damage to ${monster.name}. (Press \` key on keyboard to scroll to bottom of chat.)`
      );
    }

    if (monster.hp <= 0) {
      // Monster is defeated
      let earnedExp = player.hp * 0.5 + Math.floor(Math.random() * 50 + 50);
      player.exp += earnedExp;
      await sleep(Math.floor(Math.random() * 10000) + 3000);

      appendNamelessMessage(
        timeStamp,
        `You defeated ${monster.name} and gained ${Math.floor(earnedExp)} EXP!`
      );

      // Check if player can level up
      if (player.exp >= player.expcap) {
        setTimeout(() => console.log("waiting..."), 10000);
        player.levelup();
      } else {
        await sleep(Math.floor(Math.random() * 10000) + 3000);
        appendNamelessMessage(
          timeStamp,
          `You need ${Math.floor(
            player.expcap - player.exp
          )} more EXP to level up. (Press \` key on keyboard to scroll to bottom of chat.)`
        );
      }

      fighting = false; // End the fight
      fightingState = false;
    } else {
      await sleep(Math.floor(Math.random() * 10000) + 3000);
      appendNamelessMessage(
        timeStamp,
        `${monster.name} still has ${monster.hp} HP remaining.  (Press \` key on keyboard to scroll to bottom of chat.)`
      );
    }
  }
}

// Example game initialization
let player = new Player("Hero", 500, 300, 5, 1000, 800);
