class Superstar {
  constructor()
  {
  this.x = windowWidth/2;
  this.y = windowHeight/2;
    this.size = 15;
  }
  place() {
    fill(255,0,100,200);
    ellipse(this.x,this.y,random((this.size-random(1,6)),this.size));
    
  }

  
  getX() {
    return this.x;
  }
  
  getY() {
    return this.y;
  }
  getSize() {
    return this.size;
  }

setX(newX) {
if (newX > windowWidth){
this.x = 0;} else{
this.x = newX;}

}
}