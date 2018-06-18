var selfEasyrtcid = "";


function connect() {
  console.log("hiiiiiiiiiiiiiii");
  easyrtc.setVideoDims(640, 480);
  easyrtc.setRoomOccupantListener(convertListToButtons);
  easyrtc.easyApp("easyrtc.audioVideoSimple", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
}


function clearConnectList() {
  var otherClientDiv = document.getElementById('otherClients');
  while (otherClientDiv.hasChildNodes()) {
    otherClientDiv.removeChild(otherClientDiv.lastChild);
  }
}


function convertListToButtons(roomName, data, isPrimary) {
  clearConnectList();
  var otherClientDiv = document.getElementById('otherClients');
  for (var easyrtcid in data) {
    var button = document.createElement('button');
    button.onclick = function(easyrtcid) {
      return function() {
        performCall(easyrtcid);
      };
    }(easyrtcid);

    var label = document.createTextNode(easyrtc.idToName("Start Call"));
    button.appendChild(label);
    otherClientDiv.appendChild(button);

    console.log("calling..." + easyrtcid);
    // var video = easyrtc.getIthVideo(0);
    // var videoID = easyrtc.getCallerOfVideo(video);
    // console.log("calling..." + videoID);

    var endButton = document.createElement('button');
    endButton.onclick = function() {
      easyrtc.hangup(easyrtcid);
      hideVideo(video);
      setCallerOfVideo(video, "");
    }
    var label2 = document.createTextNode(easyrtc.idToName("End Call"));
    endButton.appendChild(label2);
    otherClientDiv.appendChild(endButton);
  }
}


function performCall(otherEasyrtcid) {
  easyrtc.hangupAll();

  var successCB = function() {};
  var failureCB = function() {};
  easyrtc.call(otherEasyrtcid, successCB, failureCB);
}


function loginSuccess(easyrtcid) {
  selfEasyrtcid = easyrtcid;
  document.getElementById("iam").innerHTML = "I am " + easyrtc.cleanId(easyrtcid);
}


function loginFailure(errorCode, message) {
  easyrtc.showError(errorCode, message);
}
