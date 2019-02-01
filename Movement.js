import { BrowserWindowProxy } from "electron";
import { Player } from "./Classes/Player";

function movePlayer(e) {
    let map = document.getElementById('Board');
    if (e.key == 'w') {
        if (Player1.Y - 1 >= 0) {
            Player1.Y -= 1;
            document.getElementById(Player1.Y + '-' + Player1.X).src = "/Images/Player.png";
            document.getElementById(Player1.Y - 1 + '-' + Player1.X).src = "";

            for (var i = player1.x - 10; i < player1.x + 10; i++) {
                if (i >= 0 && Player1.Y - 10 >= 0 && i < mapSize[1]) {
                    document.getElementById(Player1.y - 10 + '-' + i).style.display = '';
                    if (Player1.Y + 10 < mapSize[0]) {
                        document.getElementById(Player1.y + 10 + '-' + i).style.display = 'none';
                    }
                }
            }
        }
    }
}