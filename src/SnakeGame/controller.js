export default (e) => {
  const left = [65, 37];
  const right = [68, 39];
  const up = [87, 38];
  const down = [83, 40];
  var direction = null;
  if(left.indexOf(e.keyCode) >= 0) {
    direction = "left";
  }
  else if(up.indexOf(e.keyCode) >= 0) {
    direction = "up";
  }
  else if(down.indexOf(e.keyCode) >= 0) {
    direction = "down";
  }
  else if(right.indexOf(e.keyCode) >= 0){
    direction = "right";
  }
  return direction;
}
