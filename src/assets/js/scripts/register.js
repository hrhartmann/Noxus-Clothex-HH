const regbutton = document.getElementsByClassName('next-reg-button')[0];
const regbbutton = document.getElementsByClassName('back-btn')[0];
const section1 =  document.getElementsByClassName('section1')[0];
const map =  document.getElementsByClassName('map')[0];

function closeMap() {
  map.style.left = '-200%';
  section1.style.display = 'block'
};

function showMap() {
  map.style.left = '0%'
  section1.style.display = 'none'
};

if (regbutton) {
  regbutton.addEventListener('click', showMap);
  regbbutton.addEventListener('click', closeMap);

}
