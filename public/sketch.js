var galaxy = [];
var mouse = false;
var touch = false;
var currentX = 0;
var currentY = 0;
var currentSize = 0;
var move = 0.01;

var shootX = 200;
var shootY = random(20, 80);

var i = 0;

function setup() {
  createCanvas(window.screen.width, window.screen.height);
  chris = new Superstar();

  fetch("/get-data")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const newStar = new star(item.name, item.message);
        console.log(item);
        galaxy.push(newStar);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  setInterval(shoot, 10);
}

function wrapText(text, maxChars) {
  let result = [];
  let currentLine = '';
  
  // Split the text into words
  const words = text.split(' ');
  
  for (const word of words) {
    // If adding the next word would exceed the line length
    if (currentLine.length + word.length > maxChars) {
      // If the current line isn't empty, add it to results
      if (currentLine.length > 0) {
        result.push(currentLine);
        currentLine = '';
      }
      
      // If the word itself is longer than maxChars, split it
      if (word.length > maxChars) {
        let i = 0;
        while (i < word.length) {
          result.push(word.substring(i, i + maxChars));
          i += maxChars;
        }
      } else {
        currentLine = word;
      }
    } else {
      if (currentLine.length > 0) {
        currentLine += ' ' + word;
      } else {
        currentLine = word;
      }
    }
  }
  
  // Add the last line if it's not empty
  if (currentLine.length > 0) {
    result.push(currentLine);
  }
  
  return result;
}

function shoot() {
  if (shootX > windowWidth) {
    shootX = -random(5000, 15000);
    shootY = random(20, 80);
  } else {
    shootX = shootX + 30;
    shootY = shootY + 2;
  }
}
function draw() {
  background(0, 0, 35);
  fill(255);
  ellipse(shootX - 15, shootY, 3, 3, 100);
  ellipse(shootX - 10, shootY, 3, 3, 100);
  ellipse(shootX - 5, shootY, 3, 3, 200);
  ellipse(shootX, shootY, 3);
  chris.setX(chris.getX() + 0.2);
  chris.place();

  for (let amount = 0; amount < galaxy.length; amount += 1) {
    galaxy[amount].place();

    if (
      mouseX > galaxy[amount].getX() - galaxy[amount].getSize() &&
      mouseX < galaxy[amount].getX() + galaxy[amount].getSize() &&
      mouseY > galaxy[amount].getY() - galaxy[amount].getSize() &&
      mouseY < galaxy[amount].getY() + galaxy[amount].getSize()
    ) {
      touch = true;
    
      const name = galaxy[amount].getName();
      const message = galaxy[amount].getMessage();
    
      textSize(12);
      textFont("Arial");
    
      const wrappedLines = wrapText(message, 60);
      const fullText = [name, ...wrappedLines].join("\n");
    
      let maxLineWidth = textWidth(name); 
      wrappedLines.forEach(line => {
        const lineWidth = textWidth(line);
        if (lineWidth > maxLineWidth) maxLineWidth = lineWidth;
      });
    
      const lineHeight = textAscent() + textDescent();
      const totalHeight = lineHeight * (1 + wrappedLines.length);
    
      const padding = 10;
      const rectWidth = maxLineWidth + padding * 2;
      const rectHeight = totalHeight + padding * 2;
    
      fill(0);
      noStroke();
      rect(
        galaxy[amount].getX() + 20,
        galaxy[amount].getY(),
        rectWidth,
        rectHeight
      );
    
      // Draw the text
      fill(255);
      noStroke();
      textAlign(LEFT, TOP);
      text(
        fullText,
        galaxy[amount].getX() + 20 + padding,
        galaxy[amount].getY() + padding
      );
    
      // Draw underline for the name
      stroke(255);
      line(
        galaxy[amount].getX() + 20 + padding,
        galaxy[amount].getY() + padding + textAscent(),
        galaxy[amount].getX() + 20 + padding + textWidth(name),
        galaxy[amount].getY() + padding + textAscent()
      );
    
      currentX = galaxy[amount].getX();
      currentY = galaxy[amount].getY();
      currentSize = galaxy[amount].getSize();
    } else {
      touch = false;
      galaxy[amount].setX(galaxy[amount].getX() + 0.2);
    }
  }

  print(touch);
  if (
    mouseX > currentX - currentSize &&
    mouseX < currentX + currentSize &&
    mouseY > currentY - currentSize &&
    mouseY < currentY + currentSize
  ) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}
