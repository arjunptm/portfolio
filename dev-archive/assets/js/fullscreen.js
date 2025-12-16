$('#myDiv').on('click', handleClick);

$('#myDiv').click(function(e) {
  if ($('#myDiv').hasClass('fullscreen')) {
    $('#myDiv').off('click', handleClick);
  } else {
    $('#myDiv').on('click', handleClick);
  }
});

//handle the 'X' to close
$('.close-icon').on('click', function() {
  $('#myDiv .close-icon').hide();
  $('#myDiv .contentContainer').html('CLICK!');
  $('#myDiv').removeClass('fullscreen');
});

function handleClick() {
  $('#myDiv').addClass('fullscreen');
  $('#myDiv .close-icon').show();
  // delay 1s then change the html inside
  $('#myDiv .contentContainer').delay(1000)
    .queue(function(n) {
      $(this).html('<div class="popcontainer">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>');
      n();
    });

}




// https://stackoverflow.com/questions/44004207/pop-up-full-screen-div-after-click