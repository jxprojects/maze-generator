var cols = 5;
var rows =5;
var spaceBtwn = 20;
var grid = [];
var current;
var stack = [];
var solution = [];
var goal;
var solutionComplete;
var m;

function setup() {
    var w= cols * spaceBtwn;
    var h=rows * spaceBtwn;
    createCanvas(w, h);
    for (var j = 0; j<rows; j++){
        for (var i = 0; i < cols; i++) {
            var cell = new Cell(i,j);
            grid.push(cell);
        }
    }
    current = grid[0];
    grid[grid.length - 1].goal = true;
    solution.push(grid[0]);
    m = new MazeRunner(0, 0);
}

function draw(){
    background(255);
    for (var i = 0; i<grid.length; i++){
        grid[i].show();
    }
    current.visited = true;
    //current.highlight();
    var next = current.checkNeighbours();
    if (next) {
        if (!next.visited){
          if (!solutionComplete){
            solution.push(next);
            if (next.goal){
              solutionComplete = true;
            }
          }
        }
        next.visited = true;
        stack.push(current);
        removeWalls(current,next);
        current = next;
    }
    else if(stack.length > 0){
        current = stack.pop();
        if (!solutionComplete){
          solution.pop();
        }
    }
    if (solutionComplete){
      for (let i = 0; i < solution.length; i++){
        solution[i].solutionCell = true;
      }
    }

    if (isDone()) {
        frameRate(5);
        fill(0);
        m.show();
    }
}

function index(i,j){
    if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
        return -1;
    }
    return i + j * cols;
}

function Cell(i,j){
    this.i = i;
    this.j = j;
    this.walls = [true,true,true,true];
    this.visited = false;
    this.goal = false;
    this.solutionCell = false;
    this.checkNeighbours = function(){
        var neighbours = [];
        var top = grid[index(i, j-1)];
        var right = grid[index(i+1, j)];
        var bottom = grid[index(i, j+1)];
        var left = grid[index(i-1, j)];
        if (top && !top.visited){
            neighbours.push(top);
        }
        if (right && !right.visited){
            neighbours.push(right);
        }
        if (bottom && !bottom.visited){
            neighbours.push(bottom);
        }
        if (left && !left.visited){
            neighbours.push(left);
        }
        if (neighbours.length > 0){
            var r = floor(random(0, neighbours.length));
            return neighbours[r];
        }
        else{
            return undefined;
        }
    }
    this.highlight = function(){
        x = this.i*spaceBtwn;
        y = this.j*spaceBtwn;
        noStroke();
        fill(0,0,255,200);
        rect(x,y,spaceBtwn,spaceBtwn);
    }
    this.show = function(){
        x = this.i*spaceBtwn;
        y = this.j*spaceBtwn;
        stroke(255);
        if (this.walls[0]){
            line(x   ,y    ,x+spaceBtwn ,y);
        }   
        if (this.walls[1]){
            line(x+spaceBtwn ,y ,x+spaceBtwn ,y+spaceBtwn);
        }
        if (this.walls[2]){
            line(x+spaceBtwn, y+spaceBtwn, x, y+spaceBtwn);
        }
        if (this.walls[3]){
            line(x ,y+spaceBtwn ,x ,y)
        }
        if (this.goal){
            noStroke();
            fill(0,255,0,100);
            rect(x,y,spaceBtwn,spaceBtwn);
        }        
        else if (this.solutionCell){
            noStroke();
            fill(255,0,0,100);
            rect(x,y,spaceBtwn,spaceBtwn);
        }else if(this.visited) {
            noStroke();
            fill(255,0,255,100);
            rect(x,y,spaceBtwn,spaceBtwn);
        }
    }
}
function removeWalls(a,b){
    var x = a.i - b.i;
    if (x === 1){
        a.walls[3] = false;
        b.walls[1] = false;
    }
    else if (x === -1){
        a.walls[1] = false;
        b.walls[3] = false; 
    }
    var y = a.j - b.j;
    if (y === 1){
        a.walls[0] = false;
        b.walls[2] = false;
    }
    else if (y === -1){
        a.walls[2] = false;
        b.walls[0] = false; 
    }   
}

function isDone() {
    var ctr = 0;
    for (var i=0; i<cols*rows; i++) {
        if (grid[i].visited == true) {
            ctr++;
        }
    }
    return ctr == cols*rows;
}

function MazeRunner(i, j) {
    this.i = i;
    this.j = j;
    this.index = index(i, j);
    this.x = this.i*spaceBtwn;
    this.y= this.j*spaceBtwn;
    this.stackPath = [];

    this.show = function() {
        noStroke();
        fill(0, 0, 0, 100);
        rect(this.x, this.y, spaceBtwn, spaceBtwn);
    };

    this.move = function() {
        var dirs = [];
        var top = grid[index(this.i, this.j-1)];
        var right = grid[index(this.i+1, this.j)];
        var bottom = grid[index(this.i, this.j+1)];
        var left = grid[index(this.i-1, this.j)];
        if (top && isConnected(this.index, "top") && top.solutionCell) {
            dirs.push(top);
        }
        if (right && isConnected(this.index, "right") && right.solutionCell) {
            dirs.push(right);
        }
        if (bottom && isConnected(this.index, "bottom") && bottom.solutionCell) {
            dirs.push(bottom);
        }
        if (left && isConnected(this.index, "left") && left.solutionCell) {
            dirs.push(left);
        }

    };

    this.updt = function() {
        this.x = this.i*spaceBtwn;
        this.y = this.j*spaceBtwn;
    }

}

function isConnected(indic, dir) {
    if (dir.equals("top")) {
        if (grid[indic].walls[0] == true) {
            return false;
        } else {
            return true;
        }
    } else if (dir.equals("right")) {
        if (grid[indic].walls[1] == true) {
            return false;
        } else {
            return true;
        }
    } else if (dir.equals("bottom")) {
        if (grid[indic].walls[2] == true) {
            return false;
        } else {
            return true;
        }
    } else {
        if (grid[indic].walls[3] == true) {
            return false;
        } else {
            return true;
        }
    }
}