$(document).ready(function() {

  // Setup connection
  let socket = io.connect();
  socket.emit('login', $('#username').text());

  var arr = []; // List of users

  $(document).on('click', '.msg_head', function() {
    var chatbox = $(this).parents().attr("rel");
    $('[rel="' + chatbox + '"] .msg_wrap').slideToggle('slow');
    return false;
  });

  $(document).on('click', '.close', function() {
    var chatbox = $(this).parents().parents().attr("rel");
    $('[rel="' + chatbox + '"]').remove();
    arr.splice($.inArray(chatbox, arr), 1);
    displayChatBox();
    return false;
  });

  $(document).on('click', '.contact', function() {
    if (!$(this).hasClass("disabled")) {
      var userID = $(this).parent().attr("id");
      //var username = $(this).prev().text() ;

      if ($.inArray(userID, arr) != -1) {
        arr.splice($.inArray(userID, arr), 1);
      }

      addChatBox(userID);
      socket.emit('chatbox clicked', {
        user: $('#username').text(),
        to: userID
      });
    }
  });


  $(document).on('keypress', 'textarea', function(e) {
    if (e.keyCode == 13) {
      var msg = $(this).val();
      $(this).val('');

      if (msg.trim().length != 0) {
        var userID = $(this).parents().parents().parents().attr("rel");
        $('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + userID + '"] .msg_push');
        // Autoscroll to bottom of chat
        $(".msg_body").animate({
          scrollTop: $(".msg_body")[0].scrollHeight
        }, 100);
        // Send message to server
        socket.emit('to server', {
          from: $('#username').text(),
          to: userID,
          msg: msg
        });
      }
    }
  });


  socket.on('user_connected', function(data) {
    for (var i = 0; i < data.length; i++) {
      let user = data[i].replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
      $("#" + user).find('button').removeClass('disabled');
    }
  });

  // Recieving messages from server
  socket.on('to client', function(data) {
    let userID = data.from
    if (!$('div[rel="' + userID + '"]').length) {
      addChatBox(userID);
    }
    $('<div class="msg-left">' + data.msg + '</div>').insertBefore('[rel="' + userID + '"] .msg_push');
    // Autoscroll to bottom of chat
    $(".msg_body").animate({
      scrollTop: $(".msg_body")[0].scrollHeight
    }, 100);
  });

  socket.on('display history', function(data) {
    let userID = data.user;
    if (data.pos == 'left') {
      console.log(data.msg);
      $('<div class="msg-left">' + data.msg + '</div>').insertBefore('[rel="' + userID + '"] .msg_push');
      // Autoscroll to bottom of chat
      $(".msg_body").animate({
        scrollTop: $(".msg_body")[0].scrollHeight
      }, 100);
    } else if (data.pos == 'right') {
      console.log(data.msg);
      $('<div class="msg-right">' + data.msg + '</div>').insertBefore('[rel="' + userID + '"] .msg_push');
      // Autoscroll to bottom of chat
      $(".msg_body").animate({
        scrollTop: $(".msg_body")[0].scrollHeight
      }, 100);
    }
  });

  socket.on('user_disconnected', function(data) {
    $('.contact').each(function() {
      $(this).addClass('disabled');
    });
    for (var i = 0; i < data.length; i++) {
      let user = data[i].replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
      $("#" + user).find('button').removeClass('disabled');
    }
  })

  function displayChatBox() {
    i = 20; // start position //270
    j = 260; //next position

    $.each(arr, function(index, value) {
      if (index < 4) {
        $('[rel="' + value + '"]').css("right", i);
        $('[rel="' + value + '"]').show();
        i = i + j;
      } else {
        $('[rel="' + value + '"]').hide();
      }
    });
  }


  function addChatBox(userID) {
    arr.unshift(userID);
    chatPopup = '<div class="msg_box" style="right:270px" rel="' + userID + '">' +
      '<div class="msg_head">' + userID +
      '<div class="close">x</div> </div>' +
      '<div class="msg_wrap"> <div class="msg_body">	<div class="msg_push"></div> </div>' +
      '<div class="msg_footer"><textarea class="msg_input" rows="4"></textarea></div> </div> </div>';

    $("body").append(chatPopup);
    displayChatBox();
  }
});
