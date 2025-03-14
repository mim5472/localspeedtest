let btn_start_dn = document.getElementById("btn_start_dn");

function download_speed() {
  let xhttp = new XMLHttpRequest;
  var start_time;
  var end_time;
  xhttp.onreadystatechange = function() {
    if (this.status == 200 && this.readyState == 4) {
      document.getElementById("hidden_data").innerHTML = this.responseText;
    };
  };
  xhttp.onloadstart = function () {
    btn_start_dn.classList.add("d-none");
    start_time = new Date();
  };
  xhttp.onprogress = function(e) {
    end_time = new Date();
    time_diff = (end_time.getTime() - start_time.getTime()) / 1000;
    dn_speed = (e.loaded * 8) / time_diff;
    dn_kbps = (Math.round(dn_speed / (1000000))).toLocaleString();
    document.getElementById("dn-time").innerHTML = time_diff + ' seconds';
    document.getElementById("dn-speed").innerHTML = dn_kbps + ' Mbps';
  };
  xhttp.onloadend = function() {
    document.getElementById("message").innerHTML = "Starting upload speed test";
    setTimeout(upload_speed, 3000);
  };
  xhttp.open("GET", "/download/random_data.txt");
  xhttp.send();
};

function upload_speed() {
  let xhttp = new XMLHttpRequest;
  var start_time;
  var end_time;
  let form_data = new FormData();
  upload_data = new Blob([document.getElementById("hidden_data").innerHTML], { type: "text/plain" });
  form_data.append("upload_data", upload_data);
  xhttp.upload.onloadstart = function() {
    start_time = new Date();
  };
  xhttp.upload.onprogress = function(e) {
    end_time = new Date();
    time_diff = (end_time.getTime() - start_time.getTime()) / 1000;
    up_speed = (e.loaded * 8) / time_diff;
    up_kbps = (Math.round(up_speed / (1000000))).toLocaleString();
    document.getElementById("up-time").innerHTML = time_diff + ' seconds';
    document.getElementById("up-speed").innerHTML = up_kbps + ' Mbps';
  };
  xhttp.upload.onloadend = function() {
    document.getElementById("hidden_data").innerHTML = "";
    btn_start_dn.innerHTML = "Restart Speed Test";
    btn_start_dn.classList.remove("d-none");
  };
  xhttp.open("POST", "/upload/");
  xhttp.send(form_data);
};


function run_speedtest() {
  document.getElementById("result").classList.remove("d-none");
  setTimeout(download_speed, 3000);
  document.getElementById("message").innerHTML = "Starting download speed test";
};

btn_start_dn.addEventListener("click", run_speedtest);