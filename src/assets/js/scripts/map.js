

const falsebutton = document.getElementsByClassName('next-reg-button')[0];
  /**
  * Moves the map to display over Stgo
  *
  * @param  {H.Map} map      A HERE Map instance within the application
  */
  if (falsebutton) {
    function moveMapToBerlin(map){
    map.setCenter({lat:-33.498424, lng:-70.611233});
    map.setZoom(16);
    }

    /**
    * Boilerplate map initialization code starts below:
    */

    //Step 1: initialize communication with the platform
    // In your own code, replace variable window.apikey with your own apikey
    var platform = new H.service.Platform({
    'apikey': 'up_GScCD11tPLjBvfo_xyiwTwahAoInqvdy5lE4H04k'
    });
    var defaultLayers = platform.createDefaultLayers();

    //Step 2: initialize a map - this map is centered over Europe
    var map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map,{
    center: {lat:-33.498424, lng:-70.611233},
    zoom: 16,
    pixelRatio: window.devicePixelRatio || 1
    });
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener('resize', () => map.getViewPort().resize());

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    // Now use the map as required...
    window.onload = function () {
    moveMapToBerlin(map);
    map.addEventListener("tap", event => {
      const position = map.screenToGeo(
        event.currentPointer.viewportX,
        event.currentPointer.viewportY

      );
      map.removeObjects(map.getObjects ())
      console.log(position);
      //var icon = new H.map.Icon("<%= assetPath('home_icon.png') %>");
      //const marker = new H.map.Marker(position, {icon: icon});
      const marker = new H.map.Marker(position);
      map.addObject(marker);
      const lat = document.getElementById('lat');
      const long = document.getElementById('long');
      lat.value = position.lat;
      long.value = position.lng;

    });
    }
  }
