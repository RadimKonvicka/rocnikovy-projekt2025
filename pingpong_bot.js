let levaPalka;  
let pravaPalka; 
let micek;     
let winSound = new Audio('./win.mp3');
let bounceSound = new Audio('./bounce.mp3');
let pointSound = new Audio('./point.mp3');


const sirka = 1000;  
const vyska = 500;   

let hrac1 = 0;  
let hrac2 = 0;  
const maxSkore = 5;

class Palka1 {
  constructor(x, y) {
    this.x = x;         
    this.y = y;         
    this.sirka = 20;    
    this.vyska = 100;   
    this.rychlost = 11;  
  }
  vykresli() {
    fill(255, 0, 0);    
    rect(this.x, this.y, this.sirka, this.vyska);
  }
  pohyb(move) {
    this.y = constrain(this.y + move * this.rychlost, 0, vyska - this.vyska);
  }
}

class Palka2 {
  constructor(x, y) {   
    this.x = x;         
    this.y = y;         
    this.sirka = 20;    
    this.vyska = 100;   
    this.rychlost = 8;  
  }

  vykresli() {          
    fill(0, 0, 255);    
    rect(this.x, this.y, this.sirka, this.vyska); 
  }

  pohybAI(micek) {            
    if (micek.y < this.y + this.vyska / 2) {
      this.y -= this.rychlost;
    } else if (micek.y > this.y + this.vyska / 2) {
      this.y += this.rychlost;
    }
    this.y = constrain(this.y, 0, vyska - this.vyska);
  }
}

class Micek {
  constructor() {
    this.rychlostMicek = 6;     
    this.x = sirka / 2;         
    this.y = vyska / 2;         
    this.prumer = 20;           
    this.rychlostX = this.rychlostMicek; 
    this.rychlostY = this.rychlostMicek; 
  }

  vykresli() {                  
    fill(255, 255, 255);         
    ellipse(this.x, this.y, this.prumer); 
  }

  aktualizuj() {                 
    this.x += this.rychlostX;    
    this.y += this.rychlostY;    
    if (this.y <= 0 || this.y >= vyska) {
      this.rychlostY *= -1.10;      
    }
  }

  naraz(palka) {                 
    return (
      this.x - this.prumer / 2 <= palka.x + palka.sirka &&  
      this.x + this.prumer / 2 >= palka.x &&                
      this.y >= palka.y &&                                  
      this.y <= palka.y + palka.vyska                       
    );
  }

  mimoHriste() {                 
    return this.x <= 0 || this.x >= sirka;  
  }
}

function points() {
  textSize(32);                      
  fill(255);                          
  textAlign(CENTER, TOP);             
  text(`${hrac1} : ${hrac2}`, sirka / 2, 10);
}

function updateScores() {
  let player1Element = document.getElementById('player1-score'); 
  let player2Element = document.getElementById('player2-score'); 

  if (player1Element && player2Element) {
    player1Element.textContent = hrac1;    
    player2Element.textContent = hrac2;    
  } else {
    console.error("Elementy pro skóre nebyly nalezeny.");
  }
}

function setup() {
  let holder = document.getElementById("pole");                      
  let canvas = createCanvas(sirka, vyska);       
  canvas.parent(holder);                         
  levaPalka = new Palka1(10, vyska / 2 - 50);     
  pravaPalka = new Palka2(sirka - 30, vyska / 2 - 50);
  micek = new Micek();                           
}

function draw() {
  background(0);          
  points();               

  levaPalka.vykresli();    
  pravaPalka.vykresli();   
  micek.vykresli();        
  micek.aktualizuj();      

  pravaPalka.pohybAI(micek);

  if (micek.naraz(levaPalka) || micek.naraz(pravaPalka)) {
    micek.rychlostX *= -1.15;  
    pointSound.play();
  } 

  if (micek.mimoHriste()) { 
    if (micek.x <= 0) {
      hrac2++;             
    } else if (micek.x >= sirka) {
      hrac1++;             
    }
    bounceSound.play();
    micek = new Micek();   
    updateScores();        
  }

  if (hrac1 >= maxSkore || hrac2 >= maxSkore) {
    noLoop();
    background(0);
    fill(255);                          
    textAlign(CENTER, TOP);     
    winSound.play();        
    text("Konec hry, %s vyhrál!".replace("%s", hrac1 >= maxSkore ? "červený hráč" : "modrý hráč"), sirka / 2, vyska / 2);
  }

  if (keyIsDown(87)) {     
    levaPalka.pohyb(-1);
  }
  if (keyIsDown(83)) {     
    levaPalka.pohyb(1);
  }
}
