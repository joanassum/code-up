function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("tutorList");
  tr = table.getElementsByClassName("tutorElem");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByClassName("tutorName")[0];
    console.log(td);
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

/*filterSelection("all")
function search(c) {
  var x, i;
  x = document.getElementsByClassName("search");
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}
*/
