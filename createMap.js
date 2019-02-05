	addEventListener('message', (d) =>{
		let result = []
		let BoardOverlay = [];
		let pixels = d.data;
		let map = pixels;
		let Board = ""//document.getElementById('Board');
		let whichRue = 0;
		let BoardWidth = pixels.shape[1];
		let BoardHeight = pixels.shape[0];
		let mapSize=[BoardHeight,BoardWidth];
		//document.getElementById('Board').style.display = "";
		/*for (i = 0; i < BoardHeight; i++) {
			console.log(i);
			for (j = 0; j < BoardWidth; j++) {
				Board += ("<img src='./Images/transparent.png' class='Tile' id='" + i + "-" + j + "' style='display:none; width:30px; height:30px;'/>");
			}
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
			if (map.data[i] < 3 && map.data[i + 1] < 3 && map.data[i + 2] < 3) {
				Board += ("<img src='./Images/transparent.png' class='Tile' id='" + Math.floor(i/200) + "-" + (i/4)%50 + "' style='display:none; width:30px; height:30px;background-image:url(./Images/border.png);'/>");
				rowContent.push(0);
			}
			//Water
			else if (map.data[i] < 3 && map.data[i + 1] < 3 && (map.data[i + 2] >= 251 && map.data[i + 2] <= 255)) {
				Board += ("<img src='./Images/transparent.png' class='Tile' id='" + Math.floor(i/200) + "-" + (i/4)%50 + "' style='display:none; width:30px; height:30px;background-image: url(./Images/ocean.png);'/>");
				rowContent.push(1);
			}
			//Grass
			else if (map.data[i] < 23 && map.data[i] > 13 && map.data[i + 1] > 122 && map.data[i + 1] < 132 && map.data[i + 2] < 9) {
				Board += ("<img src='./Images/transparent.png' class='Tile' id='" + Math.floor(i/200) + "-" + (i/4)%50 + "' style='display:none; width:30px; height:30px;background-image:url(./Images/grass.png);'/>");
				rowContent.push(2);
			}
			//Ground
			else if (map.data[i] < 133 && map.data[i] > 123 && map.data[i + 1] > 122 && map.data[i + 1] < 132 && map.data[i + 2] < 133 && map.data[i + 2] > 123) {
				Board += ("<img src='./Images/transparent.png' class='Tile' id='" + Math.floor(i/200) + "-" + (i/4)%50 + "' style='display:none; width:30px; height:30px;background-image:url(./Images/ground.png);'/>");
				rowContent.push(2);
			}
			//Door
			else if (map.data[i] > 250 && map.data[i + 1] > 250 && map.data[i + 2] < 110 && map.data[i + 2] > 95) {
				console.log("agein agein!!!!")
				Board += ("<img src='./Images/transparent.png' class='Tile' id='" + Math.floor(i/200) + "-" + (i/4)%50 + "' style='display:none; width:30px; height:30px;background-image:url(./Images/door.png);'/>");
				rowContent.push(3);
			} else {
				console.log(i)
			}
		}
		BoardOverlay.push(rowContent)
		result.push(Board);result.push(BoardOverlay)
		self.postMessage(result);
	});