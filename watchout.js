// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
}

var gameStats ={
  score: 0,
  bestScore: 0
}

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
}

var gameBoard = d3.select('.gameBoard').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height)
                .attr('class', 'svg');

var updateScore = function() {
        d3.select('.current').select('span').text(gameStats.score.toString());
}

var updateBestScore = function() {
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  d3.select(".high").select('span').text(gameStats.bestScore.toString());
}

// player

var Player = function(gameOptions) {
  this.fill = '#ff6600';
  this.x = axes.x(50);
  this.y = axes.y(50);
  this.angle = 0;
  this.r = 20;
  this.el = gameBoard.append('svg:circle')
            .attr('r', this.r)
            .attr('fill', this.fill)
            .attr('cx', this.x)
            .attr('cy', this.y)
            .attr('class', 'player')



  this.gameOptions = gameOptions;

}

Player.prototype.getX = function(){
  return this.x;
}
Player.prototype.setX = function(x){
  var minX = this.gameOptions.padding;
  var maxX = this.gameOptions.width - this.gameOptions.padding;
  if(x <= minX) {
    x = minX;
  } else if (x >= maxX) {
    x = maxX;
  }
  this.x = x;
}

Player.prototype.getY = function(){
  return this.y;
}

Player.prototype.setY = function(y){
  var minY = this.gameOptions.padding;
  var maxY = this.gameOptions.width - this.gameOptions.padding;
  if(y <= minY) {
    y = minY;
  } else if (y >= maxY) {
    y = maxY;
  }
  this.y = y;
}

var player = new Player(gameOptions);

var move = function(x, y){
  this.attr('cx', x)
  player.x = x;
  this.attr('cy', y)
  player.y = y;
}

player.el.call(
  d3.behavior.drag()
  .on('drag', function(){
  move.call(player.el, d3.event.x, d3.event.y);
})
);

// Enemies

var enemies = [];

var createEnemies = function() {
  for (var i = 0; i < gameOptions.nEnemies; i++) {
    var enemy = {
      x: axes.x(Math.random() * 100),
      y: axes.y(Math.random() * 100)
    }
    enemies.push(enemy);
  }
}

createEnemies();

gameBoard.selectAll('.enemy')
  .data(enemies)
  .enter()
  .append('circle')
  .attr('cx', function(d) {
    return d.x;
  })
  .attr('cy', function(d) {
    return d.y;
  })
  .attr('class', 'enemy')
  .attr('r', 10)

var shuffleX(d,i){
  enemies[i].x = axes.x(Math.random() * 100)
  return d
}

var shuffleEnemies = function() {
  gameBoard.selectAll('.enemy')
  .transition()
  .delay(function(d,i) {return i * 50;})
  .duration(1000)
  .attr('cx', function(d) { })
  .attr('cy', function(d) { return axes.y(Math.random() * 100)})
  .each('end', shuffleEnemies)
}

shuffleEnemies();

// Collision detection
var enemy =

var collisionDetection = function(enemy, collidedCallback) {
  var radiusSum = 10 + player.r;
  var xDiff =
}



// for each enemy
  // compare position to player
  // if the distance between their centers is less than sum of their radii
    // then collision occures (reset score)


