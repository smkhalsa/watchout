//Use YOUR Firebase URL (not the one below)
  var fb = new Firebase("https://d3asteroid.firebaseio.com");

  /* Remember to include firebase JS Library
  <script src="https://cdn.firebase.com/js/client/2.2.5/firebase.js"></script>
  */

fb.set({test: "we did it!!!"})
// start slingin' some d3 here.
var gameStats = fb.child("gameStats");

fb.set({
  gameStats: {
    score: 0,
    bestScore: 0,
    collisions: 0
  }
});
gameStats.update({ score : 10 });

var score = gameStats.child('score');

score.on("value", function(data) {
  d3.select('.current').select('span').text(data.val().toString());
});


var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 20,
  padding: 20
}

// var gameStats = {
//   score: 0,
//   bestScore: 0,
//   collisions: 0
// }

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
}

var gameBoard = d3.select('.gameBoard').append('svg:svg')
                .attr('width', gameOptions.width)
                .attr('height', gameOptions.height)
                .attr('class', 'svg');

var updateScore = function() {


}



var updateBestScore = function() {
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  d3.select(".high").select('span').text(gameStats.bestScore.toString());
  d3.select(".collisions").select('span').text(gameStats.collisions.toString());
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



var shuffleEnemies = function() {
  gameBoard.selectAll('.enemy')
  .transition()
  .delay(function(d,i) {return i * 50;})
  .duration(1000)
  .tween('getPosition', function() {
    var thisEnemy = d3.select(this);
    return function(t) {
      gameStats.score++;
      updateScore();
      //console.log(thisEnemy.attr('cx'))
      var currentX = thisEnemy.attr('cx');
      var currentY = thisEnemy.attr('cy');

      checkCollision.call(thisEnemy, currentX, currentY, player.x, player.y );
    }
  })
  .attr('cx', function(d) { return axes.x(Math.random() * 100)})
  .attr('cy', function(d) { return axes.y(Math.random() * 100)})
  .each('end', shuffleEnemies)
}

shuffleEnemies();

// Collision detection function

var checkCollision = function(enemyX, enemyY, playerX, playerY) {
  var radiusSum = parseInt(this.attr('r')) + player.r;
  var xDiff = enemyX-playerX;
  var yDiff = enemyY-playerY;
  var distance = Math.sqrt(Math.pow(xDiff, 2)+Math.pow(yDiff,2))
  if(distance < radiusSum){
    //console.log(this.attr('r'), player.r, radiusSum);
    // debugger;
    updateBestScore();
    gameStats.score = 0;
    updateScore();
    gameStats.collisions++;
  }
}



// for each enemy
  // compare position to player
  // if the distance between their centers is less than sum of their radii
    // then collision occures (reset score)


