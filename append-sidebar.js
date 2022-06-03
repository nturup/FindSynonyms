document.addEventListener("DOMContentLoaded", function (event) {
  //File uploading
  document.getElementById('input-file').addEventListener('change', getFile)

  function getFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
      placeFileContent(document.getElementById('content-data'), input.files[0])
    }
  }

  function placeFileContent(target, file) {
    readFileContent(file).then(content => {
      target.value = content
      modal.style.display = "block";
    }).catch(error => console.log(error))
  }

  function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result)
      reader.onerror = error => reject(error)
      reader.readAsText(file)
    })
  }
  //showing popup
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  }
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  //Get selection and replacing
  document.addEventListener('dblclick', function () {
    setTimeout(getprint, 2000)
  }, false);
  $("#sessions").change(function () {
    getSelectionTextAndReplace($("#sessions").val());
  })

  function getprint() {
    let thetext = getSelectionText()
    if (thetext.length > 0) { // check there's some text selected
      console.log(thetext);
      $.ajax({
        url: "https://thesaurus.altervista.org/thesaurus/v1?word=" + thetext + "&language=en_US&output=json&key=gY7p6e5RKvwkhx2XI8WP", // NOTE: replace test_only with your own KEY
        crossDomain: true,
        success: function (data) {
          $("#div1").html("");
          if (data.length != 0) {
            let dataArr = [];
            output = "";
            console.log(data.response);
            for (key in data.response) {
              output = "";
              if (data.response[key].list.synonyms.includes("|")) {
                dataArr.push(data.response[key].list.synonyms.split(" ")[0].split("|")[0]);
              } else {
                dataArr.push(data.response[key].list.synonyms.split(" ")[0]);
              }
              output += data.response[key].list.synonyms.split(" ")[0].split("|").join(",") + "<br>";
            }
            console.log(dataArr)
            dataArr.unshift("Select Word");
            $('#sessions').html("");
            dataArr.map((v) => {
              $('#sessions').append($('<option></option>').val(v).html(v));
            })
            dataArr = [];
          } else $("#div1").html("empty data");
        },
        error: function (xhr, status, error) {
          $("#div1").html("No Synonyms Found: " + status);
        }
      });
    }
  }

  function getSelectionTextAndReplace(str) {
    $("#content-data").replaceSelectedText(str + " ");
  }

  function getSelectionText() {
    var selectedText = ""
    if (window.getSelection) { 
      selectedText = window.getSelection().toString()
    }
    return selectedText.trim();
  }
})