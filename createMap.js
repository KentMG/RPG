addEventListener('message', (d) => {
	let result = []
	let row = d.data[0];
	let map = d.data[1];
	let background = d.data[2];
	let Board = ""
	let BoardWidth = map.shape[1];
	let BoardHeight = map.shape[0];
	let mapSize = [BoardHeight, BoardWidth];
	//Color Tiles
	let rowContent = [];
	for (var i = row*(BoardWidth*4); i < (row+1)*(BoardWidth*4); i += 4) {
		if (i / 4 % mapSize[0] == 0 && i != 0) {
			rowContent = [];
		}
		//Border
		if (map.data[i] == 0 && map.data[i + 1] == 0 && map.data[i + 2] == 0) {
			Board += ("<img src='./Images/border.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; ");
			rowContent.push(0);
		}
		//Deep Water
		else if (map.data[i] == 0 && map.data[i + 1] == 0 && map.data[i + 2] == 153) {
			Board += ("<img src='./Images/deepWater.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; ");
			rowContent.push(0);
		}
		//trees
		else if (map.data[i] == 0 && map.data[i + 1] == 153 && map.data[i + 2] == 0) {
			Board += ("<img src='./Images/trees.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; ");
			rowContent.push(0);
		}
		//trees tops
		else if (map.data[i] == 102 && map.data[i + 1] == 255 && map.data[i + 2] == 153) {
			Board += ("<img src='./Images/TreeTop.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; ");
			rowContent.push(0);
		}
		//Door
		else if (map.data[i] == 255 && map.data[i + 1] == 255 && map.data[i + 2] == 102) {
			Board += ("<img src='./Images/door.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; ");
			rowContent.push(3);
		}
		//Horizontal wall
		else if (map.data[i] == 102 && map.data[i + 1] == 102 && map.data[i + 2] == 102) {
			Board += ("<img src='./Images/HorWall.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; ");
			rowContent.push(0);
		}
		//Bottom Left corner wall
		else if (map.data[i] == 51 && map.data[i + 1] == 51 && map.data[i + 2] == 51) {
			Board += ("<img src='./Images/CornerWall.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; ");
			rowContent.push(0);
		} 
		//Vertical wall
		else if (map.data[i] == 204 && map.data[i + 1] == 102 && map.data[i + 2] == 102) {
			Board += ("<img src='./Images/VertWall.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; ");
			rowContent.push(0);
		}
		//Top Left corner wall
		else if (map.data[i] == 204 && map.data[i + 1] == 153 && map.data[i + 2] == 153) {
			Board += ("<img src='./Images/CornerWall.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; transform: rotate(90deg); ");
			rowContent.push(0);
		}
		//Top Right corner wall
		else if (map.data[i] == 153 && map.data[i + 1] == 102 && map.data[i + 2] == 102) {
			Board += ("<img src='./Images/CornerWall.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; transform: rotate(180deg); ");
			rowContent.push(0);
		}
		//Top Left corner wall
		else if (map.data[i] == 102 && map.data[i + 1] == 51 && map.data[i + 2] == 51) {
			Board += ("<img src='./Images/CornerWall.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; transform: rotate(270deg); ");
			rowContent.push(0);
		}
		//end of wall
		else if (map.data[i] == 255 && map.data[i + 1] == 102 && map.data[i + 2] == 102) {
			Board += ("<img src='./Images/wallEnd.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; ");
		}  else if(map.data[i] == 255 && map.data[i+1] == 255 && map.data[i + 2] == 255){
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px; ");
		}else{
			console.log(map.data[i])
			console.log(map.data[i + 1])
			console.log(map.data[i + 2])
		}
		//ground
		if (background.data[i] == 153 && background.data[i + 1] == 153 && background.data[i + 2] == 153) {
			Board += ("background-image:url(./Images/ground.png);'/>");
		}
		//Water
		else if (background.data[i] == 0 && background.data[i + 1] == 51 && background.data[i + 2] == 204) {
			Board += ("background-image:url(./Images/ground.png);'/>");
			rowContent.push(1);
		}
		//Grass
		else if(background.data[i]==0 && background.data[i+1] == 102 && background.data[i+2] == 0){
			Board += ("background-image:url(./Images/grass.png);'/>");
		}
	}

	result.push(Board);
	result.push(rowContent);
	result.push(row)
	self.postMessage(result);
});