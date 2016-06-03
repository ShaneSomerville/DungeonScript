/**
 * Created by thomascase on 6/2/16.
 */
function Actor(parent_area){
    var self = this;
    self.x_coord = null;
    self.y_coord = null;
    self.current_hitpoints = null;
    self.max_hitpoints = null;
    self.parent_area = parent_area;
    self.occupied_tile = null;
}
Actor.prototype.leave_tile = function(){
    // $(this.occupied_tile).removeClass('occupied');
    this.occupied_tile.occupant = null;
    this.occupied_tile = null;
    console.log(this.parent_area.tile_grid);
    $(this.parent_area.tile_grid[this.x_coord][this.y_coord].dom_element).removeClass('occupied');
    this.x_coord = null;
    this.y_coord = null;
};
Actor.prototype.move_to = function(new_x, new_y){
    console.log('moving to: ', new_x, new_y);
    if(this.occupied_tile != null) {
        this.leave_tile();
    }
    this.x_coord=new_x;
    this.y_coord=new_y;
    this.occupied_tile = this.parent_area.tile_grid[new_x][new_y];
    this.occupied_tile.occupant = this;
    $(this.occupied_tile.dom_element).addClass('occupied');
};
Actor.prototype.lose_hitpoints = function(num){
    this.current_hitpoints -= num;
    if(this.current_hitpoints <= 0){
        //die here
    }
};
Actor.prototype.gain_hitpoints= function(num){
    this.current_hitpoints += num;
    if(this.current_hitpoints > this.max_hitpoints){
        this.current_hitpoints = this.max_hitpoints;
    }
};
function Area(){
    var self = this;
    self.row_width = 15;
    self.column_height = 10;
    self.tile_grid = [];
    self.active_x_coord = 0;
    self.active_y_coord = 0;
    self.actor_array = [];
    self.selected_actor = null;
    self.container = $("#grid-container");
    for (var i = 0; i < self.row_width; i++){
        self.tile_grid[i] = [];
    }
}
Area.prototype.select_actor = function(actor){
    this.selected_actor = actor;
    $(this.selected_actor.occupied_tile).addClass('selected');
};
Area.prototype.unselect_actor = function(){
    this.selected_actor = null;
};
Area.prototype.generate_actor = function(){
    var new_actor = new Actor(this);
    new_actor.move_to(0,0);
    this.actor_array.push(new_actor);
};
Area.prototype.build_grid = function(){
    for (var y_coord = 0; y_coord < this.column_height; y_coord++){
        for (var x_coord = 0; x_coord < this.row_width; x_coord++){
            var tile = $("<div>").addClass('tile').css({
                top: y_coord*60,
                left: x_coord*60
            });
            tile.text(x_coord + ' '+ y_coord);
            this.tile_grid[x_coord][y_coord] = new Tile(x_coord, y_coord, tile);
            this.container.append(tile);
        }
    }
    this.tile_grid[this.active_x_coord][this.active_y_coord].make_active();
    console.log(this.tile_grid);
    this.generate_actor()
};
function Tile(x_coord, y_coord, dom_element){
    var self = this;
    self.x_coord=x_coord;
    self.y_coord=y_coord;
    self.dom_element = dom_element;
    self.occupied = false;
    self.occupant = null;
}
Tile.prototype.make_active = function(){
    $(this.dom_element).addClass('active');
};
Tile.prototype.remove_active = function(){
    $(this.dom_element).removeClass('active');
};
Area.prototype.in_bounds = function (x_coord, y_coord){
    console.log('checking bounds');
    var success = !(x_coord < 0 || y_coord < 0 || x_coord >= this.row_width || y_coord >= this.column_height);
    console.log(success);
    return success;
};
Area.prototype.make_move = function(new_x, new_y){
    this.tile_grid[this.active_x_coord][this.active_y_coord].remove_active();
    this.tile_grid[new_x][new_y].make_active();
    this.active_x_coord=new_x; this.active_y_coord=new_y;
};
Area.prototype.key_pressed = function (key_num){
    console.log('key pressed: ' + key_num);
    var x = this.active_x_coord;
    var y = this.active_y_coord;
    switch (key_num){
        case 119:
            if (this.in_bounds(x, y-1)){
                this.make_move(x, y-1);
            }
            break;
        case 97:
            //move left
            if (this.in_bounds(x-1, y)){
                this.make_move(x-1, y);
            }
            break;
        case 115:
            //move down
            if (this.in_bounds(x, y+1)) {
                this.make_move(x, y + 1);
            }
            break;
        case 100:
            //move right
            if (this.in_bounds(x+1, y)) {
                this.make_move(x + 1, y);
            }
            break;
        case 32:
            if(this.selected_actor == null){
                if(this.tile_grid[x][y].occupant == null){
                    break;
                }
                console.log(this.tile_grid[x][y].occupant);
                this.select_actor(this.tile_grid[x][y].occupant);
            }
            else{
                this.selected_actor.move_to(x, y);
            }
            break;
        default:
            console.log('no bueno');
    }
};
Area.prototype.move_actor = function(actor, new_x, new_y){
    actor.move_to(new_x, new_y);
};
var my_area;
$(document).ready(function(){
    my_area = new Area();
    my_area.build_grid();
    $(document).keypress(function(e){
        my_area.key_pressed(e.which);
    });
    my_area.move_actor(my_area.actor_array[0], 1,1);
});