const MusicInBackground = new Audio('../saper/css/music/index.mp3');

var setting = JSON.parse(localStorage.getItem('settings'));
MusicInBackground.currentTime = setting.valueMusic;
MusicInBackground.play();

function ExitSite() {
      localStorage.setItem('settings', JSON.stringify({
            valueBomb: setting.valueBomb,
            area: setting.area,
            valueMusic: MusicInBackground.currentTime
      }))
}