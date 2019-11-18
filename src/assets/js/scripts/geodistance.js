
const showpub =  document.getElementsByClassName('show-pub')[0];


function calculate_distance(lat1, long1, lat2, long2) {
  console.log(lat1)
  //const lat = lat1 - lat2;
  //const long = long - long2;
  //const dist = (lat^2 + long^2)^(0.5);
  //return dist;
};

if (showpub) {
  showpub.addEventListener('click', calculate_distance);
  }
//(calculate_distance(publication.user.lat, publication.user.long, currentUser.lat, currentUser.long) >= 1.1)
