/*
Requirements:
1) Create a character (object)
2) Character properties:
  - name
  - health, damage (optional)
  - ability to insult (words)
    > random selection of insults
  - ability to fight (sword sounds)
    > random selection of sword sounds
3) Battle Winner
  - option 1: declare a random winner between the two
  - option 2: make the characters inflict damage
4) Die Function:
  - Character says his last words
*/

const synth = window.speechSynthesis; 

class Character {
  constructor (name, id, images) {
    this.name = name;
    this.id = id;
    this.images = images
  }
  static insults = [
    'You rancid dim-witted malt-worm!',
    'I\'d say you look like a goblin, but that\'s an insult to goblins!',
    'Your parents must change the subject when people ask about you.',
    'You reeking ill-breeding bum-bailey.',
    'You\'re like Rapunzel but the only thing you let down is everyone else.',
    'Your mom\'s so slow it took her 9 months to make a joke!',
    'The best feature of people like you is that you die.',
    'It\'s incredible you can bring such joy to a room by simply leaving it.',
    'Did you speak? I thought someone farted.',
    'I\'ve heard more witty banter from zombies.',
    'Were you dropped on your head as a baby, or thrown against a wall?',
    'It\'s a real shame that your last words will be so vapid.',
    'Really I\'m doing you a favor by smashing up that dour pile of rotten meat you call a face.',
    'I would insult you, but mother nature has beaten me to the punch.',
    'I consider it a favor that no one will have to face you again.',
    'If I wanted to hear something from a mouth like yours, I\'d fart.',
    'You\'re so fat you could sit on a dagger and make it come out a longsword.'
  ];
  static swordSounds = [
    'Slash!',
    'Woosh!',
    'Ping!',
    'Clang!',
    'Bong!',
    'Schwing!'
  ];
  static insult () {
    return this.insults[Math.floor(Math.random() * this.insults.length)]
  }
  static swordSound() {
    return this.swordSounds[Math.floor(Math.random() * this.swordSounds.length)]
  }

  say(quote) {
    document.getElementById(this.id).innerHTML = quote
  }

  possessive() {
    if (this.name[this.name.length - 1] == 's') {
      return this.name + '\''
    }
    return this.name + '\'s'
  }
}



function initiateCombat() {
  player1 = new Character('Gribble', 'player1', {
    die: 'assets/die-left.jpg',
    fight: 'assets/fight-left1.jpg',
    pose: 'assets/knight-left.jpg'
  });
  player2 = new Character('Francis', 'player2', {
    die: 'assets/die-right.jpg',
    fight: 'assets/fight-right1.jpg',
    pose: 'assets/knight-left.jpg'
  });
  narrationTextId = 'narrationText'

  queue = [
    [narrationTextId, `${player1.name} and ${player2.name} have locked eye to eye! Neither of them are having a good day. They are both armed with blades, but their first weapons of choice are their silver tongues!`, player1, 'pose', player2, 'pose'],
    [player1.id + 'Box', Character.insult()],
    [player2.id + 'Box', Character.insult()],
    [narrationTextId, `This altercation has become physical! ${player1.name} has drawn their weapon and engaged ${player2.name}!`, player1, 'fight', player2, 'fight'],
    [narrationTextId, `${player2.name} was ready, and he too had drawn his blade to counter ${player1.possessive()}!`],
    [narrationTextId, Character.swordSound()],
    [narrationTextId, Character.swordSound()],
    [narrationTextId, Character.swordSound()],
  ]

  // Determine winner
  winner = player1;
  loser = player2;
  if (Math.random() < 0.5) {
    winner = player2;
    loser = player1;
  }

  queue.push(
    [narrationTextId, `The battle has been intense! But it ends when ${winner.name} thrusts his blade through ${loser.possessive()} body.`],
    [narrationTextId, `${loser.name} falls to his knees, but not without mustering just enough energy to get one last insult out.`, loser, 'die', winner, 'pose'],
    [loser.id + 'Box', Character.insult()],
    [narrationTextId, `${loser.name} falls flat on his face, dead.`],
    [narrationTextId, `${winner.name} has won this battle.`],
  )

  document.getElementById(player1.id + 'Name').innerHTML = player1.name
  document.getElementById(player2.id + 'Name').innerHTML = player2.name
  proceed(queue)
}

function proceed(queue) {
  document.getElementById('narrationText').innerHTML = ''
  document.getElementById('player1Box').innerHTML = ''
  document.getElementById('player2Box').innerHTML = ''

  document.getElementById(queue[0][0]).innerHTML = queue[0][1]
  if (queue[0][2]) {
    document.getElementById(queue[0][2].id + 'Img').src = queue[0][2].images[queue[0][3]]
  }
  if (queue[0][4]) {
    document.getElementById(queue[0][4].id + 'Img').src = queue[0][4].images[queue[0][5]]
  }

  utterThis = new SpeechSynthesisUtterance(queue[0][1]);

  switch (queue[0][0]) {
    case 'player1Box':
      utterThis.voice = synth.getVoices()[0]
      break;
    case 'player2Box':
      utterThis.voice = synth.getVoices()[1]
      break;
    default:
      break;
  } 

  utterThis.addEventListener('end', (e) => {
    if (queue.length > 1) {
      proceed(queue.slice(1))
    }
  })
  
  synth.speak(utterThis)


}
 
initiateCombat()