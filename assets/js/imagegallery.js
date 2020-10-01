var slideIndex = 1;
showSlides(slideIndex);


var slideVideoIndex = 1;
showVideoSlides(slideVideoIndex);

var slideCIndex = 1;
showCSlides(slideCIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" gallery_active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " gallery_active";
}

// Next/previous controls
function plusVideoSlides(n) {
  showVideoSlides(slideVideoIndex += n);
    if (slideVideoIndex==3) autoplayTechteamVid();

}

// Thumbnail image controls
function currentVideoSlide(n) {
  showVideoSlides(slideVideoIndex = n);
  if (n==3) autoplayTechteamVid();
}

function showVideoSlides(n) {
  var i;
  var vslides = document.getElementsByClassName("myVideoSlides");
  var vdots = document.getElementsByClassName("videodot");
  if (n > vslides.length) {slideVideoIndex = 1}
  if (n < 1) {slideVideoIndex = vslides.length}
  for (i = 0; i < vslides.length; i++) {
      vslides[i].style.display = "none";
  }
  for (i = 0; i < vdots.length; i++) {
      vdots[i].className = vdots[i].className.replace(" gallery_vactive", "");
  }
  vslides[slideVideoIndex-1].style.display = "block";
  vdots[slideVideoIndex-1].className += " gallery_vactive";
}

function autoplayTechteamVid () {
	var vid = document.getElementById("TechTeamVideo");
	vid.click();
	vid.play();
	vid.controls = false;
}


// Next/previous controls
function plusCSlides(n) {
  showCSlides(slideCIndex += n);

}

// Thumbnail image controls
function currentCSlide(n) {
  showCSlides(slideCIndex = n);
}

function showCSlides(n) {
  var i;
  var cslides = document.getElementsByClassName("myCSlides");
  var cdots = document.getElementsByClassName("Cdot");
  if (n > cslides.length) {slideCIndex = 1}
  if (n < 1) {slideCIndex = cslides.length}
  for (i = 0; i < cslides.length; i++) {
      cslides[i].style.display = "none";
  }
  for (i = 0; i < cdots.length; i++) {
      cdots[i].className = cdots[i].className.replace(" gallery_Cactive", "");
  }
  cslides[slideCIndex-1].style.display = "block";
  cdots[slideCIndex-1].className += " gallery_Cactive";
}