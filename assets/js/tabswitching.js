function openCity(evt, cityName, projectName) {
  // Declare all variables
  var i, customtabcontent, customtablinks;

  // Get all elements with class="customtabcontent" and hide them
  customtabcontent = document.getElementById(projectName).getElementsByClassName("customtabcontent");
  for (i = 0; i < customtabcontent.length; i++) {
    customtabcontent[i].style.display = "none";
  }

  // Get all elements with class="customtablinks" and remove the class "active"
  customtablinks = document.getElementById(projectName).getElementsByClassName("customtablinks");
  for (i = 0; i < customtablinks.length; i++) {
    customtablinks[i].className = customtablinks[i].className.replace(" active", "");
  }

  // Show the current customtab, and add an "active" class to the button that opened the customtab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

defs = document.getElementsByClassName("defaultOp");
for (i=0; i<defs.length;i++) {
  defs[i].click();
}