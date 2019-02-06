addEventListener('message', (d) => {
	let result = []
	let row = d.data[0];
	let pixels = d.data[1];
	let map = pixels;
	let Board = ""
	let BoardWidth = pixels.shape[1];
	let BoardHeight = pixels.shape[0];
	let mapSize = [BoardHeight, BoardWidth];
	//Color Tiles
	let rowContent = [];
	for (var i = row*(BoardWidth*4); i < (row+1)*(BoardWidth*4); i += 4) {
		if (i / 4 % mapSize[0] == 0 && i != 0) {
			rowContent = [];
		}
		//Border
		if (map.data[i] == 0 && map.data[i + 1] == 0 && map.data[i + 2] == 0) {
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px;background-image:url(./Images/border.png);'/>");
			rowContent.push(0);
		}
		//Water
		else if (map.data[i] == 0 && map.data[i + 1] == 51 && map.data[i + 2] == 204) {
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px;background-image: url(./Images/shallowWater.png);'/>");
			rowContent.push(1);
		}
		//Deep Water
		else if (map.data[i] == 0 && map.data[i + 1] == 0 && map.data[i + 2] == 153) {
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px;background-image: url(./Images/deepWater.png);'/>");
			rowContent.push(0);
		}
		//Grass
		else if (map.data[i] == 0 && map.data[i + 1] == 102 && map.data[i + 2] == 0) {
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px;background-image:url(./Images/grass.png);'/>");
			rowContent.push(2);
		}
		//Ground
		else if (map.data[i] == 153 && map.data[i + 1] == 153 && map.data[i + 2] == 153) {
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px;background-image:url(./Images/ground.png);'/>");
			rowContent.push(2);
		}
		//Door
		else if (map.data[i] == 255 && map.data[i + 1] == 255 && map.data[i + 2] == 102) {
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + row + "-" + (i / 4) % BoardWidth + "' style='display:none; width:30px; height:30px;background-image:url(./Images/door.png);'/>");
			rowContent.push(3);
		} else {
			console.log(map.data[i])
			console.log(map.data[i + 1])
			console.log(map.data[i + 2])
		}
	}

	result.push(Board);
	result.push(rowContent);
	result.push(row)
	self.postMessage(result);
});