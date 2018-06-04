
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
      defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}'
    });
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
      defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}'
    });
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

function init() {
    init1();
    init2();
}
