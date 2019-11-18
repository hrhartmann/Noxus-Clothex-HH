document.addEventListener('DOMContentLoaded', function() {
    var selector = document.getElementById('filterIds');
    var elements = document.getElementsByName('datos')
    if (selector) {
      selector.onchange = function() {
          if (selector.value=="all"){
              for (var i = 0; i < elements.length; i++) {
                  elements[i].style.display = "inline-block";
              }
          } else {
              for (var i = 0; i < elements.length; i++) {
                  if (`datos ${selector.value}` == elements[i].className) {
                      elements[i].style.display = "inline-block";
                  } else {
                      elements[i].style.display = "none";
                  }
              }
          }
      }
    }
  });
