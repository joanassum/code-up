$(document).ready(function() {

  // Setup connection
  let socket = io();
  socket.emit('login', $('#username').text());

  let link = $(location).attr('href').slice(0, $(location).attr('href').indexOf('=') + 1) + encodeURIComponent($('#tutorID').text()) + $(location).attr('href').slice($(location).attr('href').indexOf('&tutorID='));

  socket.emit('to server', {
    from: $('#username').text(),
    to: $('#tutorID').text(),
    msg: "Please Code with me: <a href='" + link + "''>" + link + "</a>"
  });
});

/***************************** Code for white board *********************************/

// Get the modal
var modal = document.getElementById('whiteboard-container');

// Get the button that opens the modal
var btn = document.getElementById("whiteboard-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/***************************** Code for code mirror and firepad *********************************/

function init1() {
  //// Initialize Firebase.
  //// TODO: replace with your Firebase project configuration.
  var config = {
    apiKey: "AIzaSyAZCsIV66dGFDmLTA5I8XX_JycfRP0Md8E",
    authDomain: "codeup-1264f.firebaseapp.com",
    databaseURL: "https://codeup-1264f.firebaseio.com",
  };
  firebase.initializeApp(config);

  //// Get Firebase Database reference.
  var firepadRef = getExampleRef();

  //// Create CodeMirror (with line numbers and the JavaScript mode).
  var codeMirror = CodeMirror(document.getElementById('firepad-container1'), {
    lineNumbers: true,
    mode: 'javascript'
  });
  //// Create Firepad.
  var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
    defaultText: 'public class Main{\n  public static void main(String[] args) {\n    System.out.println(\"abc\");\n  }\n}'
  });

  //get a reference to the element
  var myBtn1 = document.getElementById('button1');

  myBtn1.addEventListener('click', function(event) {
    console.log('clicked');

    var e = document.getElementById("select-tutee");
    console.log(e.options[e.selectedIndex].value);

    var data = {
      data: codeMirror.getValue(),
      lang: e.options[e.selectedIndex].value
    };
    console.log(JSON.stringify(data));

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("output-box1").value = this.responseText;
      }
    };
    xhttp.open("POST", "/compile", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(data));
  });

  var mySaveBtn1 = document.getElementById('savebutton1');

  mySaveBtn1.addEventListener('click', function(event) {
    console.log("save clicked");
    saveTextAsFile();
  });

  // Reference : https://stackoverflow.com/questions/39075483/downloading-and-uploading-in-codemirror-textarea-and-skulpt-execution-issues

  function saveTextAsFile() {
    var textToWrite = codeMirror.getValue();
    var textFileAsBlob = new Blob([textToWrite], {
      type: "text/plain;charset=utf-8"
    });
    var e = document.getElementById("select-tutee");
    var lang = e.options[e.selectedIndex].value;
    var fileNameToSaveAs = "code.txt";
    if (lang === "Java") {
      fileNameToSaveAs = "code.java";
    } else if (lang === "Python") {
      fileNameToSaveAs = "code.py";
    }

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }

  function destroyClickedElement(event) {
    document.body.removeChild(event.target);
  }

}

// Helper to get hash from end of URL or generate a random one.
function getExampleRef() {
  var ref = firebase.database().ref();
  var hash = window.location.hash.replace(/#/g, '');
  if (hash) {
    ref = ref.child(hash);
  } else {
    ref = ref.push(); // generate unique location.
    window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
  }
  if (typeof console !== 'undefined') {
    console.log('Firebase data: ', ref.toString());
  }
  return ref;
}

/***************************** Code for code mirror and firepad 2 *********************************/

function init2() {
  //// Initialize Firebase.
  //// TODO: replace with your Firebase project configuration.
  var config = {
    apiKey: "AIzaSyCjY36-Dz6ONVIKVeg4_ScJo69hZWoNpxo",
    authDomain: "codeup2.firebaseapp.com",
    databaseURL: "https://codeup2.firebaseio.com",

  };
  var app2 = firebase.initializeApp(config, "a");
  console.log(app2.name);

  //// Get Firebase Database reference.
  var firepadRef = getExampleRef2(app2);

  //// Create CodeMirror (with line numbers and the JavaScript mode).
  var codeMirror = CodeMirror(document.getElementById('firepad-container2'), {
    lineNumbers: true,
    mode: 'javascript'
  });

  //// Create Firepad.
  var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
    defaultText: 'public class Main{\n  public static void main(String[] args) {\n    System.out.println(\"abc\");\n  }\n}'
  });

  //get a reference to the element
  var myBtn2 = document.getElementById('button2');

  myBtn2.addEventListener('click', function(event) {
    console.log('clicked');

    var e = document.getElementById("select-tutor");
    console.log(e.options[e.selectedIndex].value);

    var data = {
      data: codeMirror.getValue(),
      lang: e.options[e.selectedIndex].value
    };
    console.log(JSON.stringify(data));

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        document.getElementById("output-box2").value = this.responseText;
      }
    };
    xhttp.open("POST", "/compile", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(data));
  });


  var mySaveBtn1 = document.getElementById('savebutton2');

  mySaveBtn1.addEventListener('click', function(event) {
    console.log("save clicked");
    saveTextAsFile();
  });

  // Reference : https://stackoverflow.com/questions/39075483/downloading-and-uploading-in-codemirror-textarea-and-skulpt-execution-issues

  function saveTextAsFile() {
    var textToWrite = codeMirror.getValue();
    var textFileAsBlob = new Blob([textToWrite], {
      type: "text/plain;charset=utf-8"
    });
    var e = document.getElementById("select-tutor");
    var lang = e.options[e.selectedIndex].value;
    var fileNameToSaveAs = "code.txt";
    if (lang === "Java") {
      fileNameToSaveAs = "code.java";
    } else if (lang === "Python") {
      fileNameToSaveAs = "code.py";
    }

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }

  function destroyClickedElement(event) {
    document.body.removeChild(event.target);
  }


}

// Helper to get hash from end of URL or generate a random one.
function getExampleRef2(app) {
  var ref = firebase.database(app).ref();
  var hash = window.location.hash.replace(/#/g, '');
  if (hash) {
    ref = ref.child(hash);
  } else {
    ref = ref.push(); // generate unique location.
    window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
  }
  if (typeof console !== 'undefined') {
    console.log('Firebase data: ', ref.toString());
  }
  return ref;
}

/***************************** Code for Initializing *********************************/

function init() {
  init1();
  init2();
  connect();
}
