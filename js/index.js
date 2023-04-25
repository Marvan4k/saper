const MusicInBackground = new Audio('../saper/css/music/index.mp3');

if (!localStorage.getItem('settings')) {
      localStorage.setItem('settings', JSON.stringify({
            valueBomb: 1,
            area: 5,
            valueMusic: 0
      }))
}

var setting = JSON.parse(localStorage.getItem('settings'));
if (setting.valueMusic >= 199) {
      valueMusic = 0;
}
MusicInBackground.currentTime = setting.valueMusic;
MusicInBackground.play();

function ExitSite() {
      localStorage.setItem('settings', JSON.stringify({
            valueBomb: setting.valueBomb,
            area: setting.area,
            valueMusic: MusicInBackground.currentTime
      }))
}