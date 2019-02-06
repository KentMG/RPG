addEventListener('message', (d) => {
	let result = []
	let BoardOverlay = [];
	let row = d.data[0];
	let pixels = d.data[1];
	let map = pixels;
	let Board = ""//document.getElementById('Board');
	let whichRue = 0;
	let BoardWidth = pixels.shape[1];
	let BoardHeight = pixels.shape[0];
	let mapSize = [BoardHeight, BoardWidth];
	//document.getElementById('Board').style.display = "";
	/*for (i = 0; i < BoardHeight; i++) {
		console.log(i);
		for (j = 0; j < BoardWidth; j++) {
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + i + "-" + j + "' style='display:none; width:30px; height:30px;'/>");
		}
		*/
	//Color Tiles
	let rowContent = [];
	for (var i = 0; i < map.data.length; i += 4) {
		if (i / 4 % mapSize[0] == 0 && i != 0) {
			BoardOverlay.push(rowContent);
			whichRue++;
			rowContent = [];
		}
		//Border
		if (map.data[i] == 0 && map.data[i + 1] == 0 && map.data[i + 2] == 0) {
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + Math.floor(i/200) + "-" + Math.floor((i/4)%50) + "' style='display:none; width:30px; height:30px;background-image:url(./Images/border.png);'/>");
			rowContent.push(0);
		}
		//Water
		else if (map.data[i] == 0 && map.data[i + 1] == 51 && map.data[i + 2] == 204) {
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + Math.floor(i/200) + "-" + (i/4)%50 + "' style='display:none; width:30px; height:30px;background-image: url(./Images/ocean.png);'/>");
			rowContent.push(1);
		}
		//Grass
		else if (map.data[i] == 0 && map.data[i + 1] == 102 && map.data[i + 2] == 0) {
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + Math.floor(i/200) + "-" + (i/4)%50 + "' style='display:none; width:30px; height:30px;background-image:url(./Images/grass.png);'/>");
			rowContent.push(2);
		}
		//Ground
		else if (map.data[i] ==153 && map.data[i + 1] == 153 && map.data[i + 2] == 153) {
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + Math.floor(i/200) + "-" + (i/4)%50 + "' style='display:none; width:30px; height:30px;background-image:url(./Images/ground.png);'/>");
			rowContent.push(2);
		}
		//Door
		else if (map.data[i] > 250 && map.data[i + 1] > 250 && map.data[i + 2] < 110 && map.data[i + 2] > 95) {
			console.log("agein agein!!!!")
			Board += ("<img src='./Images/transparent.png' class='Tile' id='" + Math.floor(i/200) + "-" + (i/4)%50 + "' style='display:none; width:30px; height:30px;background-image:url(./Images/door.png);'/>");
			rowContent.push(3);
		} else {
			console.log(map.data[i])
			console.log(map.data[i+1])
			console.log(map.data[i+2])
		}
		}
	BoardOverlay.push(rowContent)
	result.push(Board); 
	result.push(BoardOverlay);
	result.push(row)
	self.postMessage(result);
});