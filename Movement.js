import { BrowserWindowProxy } from "electron";

function movePlayer(e){
    let map=document.getElementById('Board');
    if(e.key == 'w'){
        Player1.y -=1;
        for(var i = player1.x -10; i<player1.x +10; i++){
            if(i>=0){
                map[i][player1.y-10].style.display = '';
            }
        }
    }
}