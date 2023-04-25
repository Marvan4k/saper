const container = document.querySelector('.container');
const images = ['../image/gold-win.png', '../image/silver-win.png', '../image/bronze-win.png'];
const MusicInBackground = new Audio('../saper/css/music/index.mp3');

let persons = [
   {
      name: 'person',
      record: '1',
      date: ''
   },
   {
      name: 'person',
      record: '2'
   },
   {
      name: 'person',
      record: '3'
   },
   {
      name: 'person',
      record: '4'
   },
   {
      name: 'person',
      record: '6'
   },
   {
      name: 'person',
      record: '5'
   },
]

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