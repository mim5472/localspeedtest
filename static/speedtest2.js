const DOWNLOAD_URL = "/download/random_data.txt";
const UPLOAD_URL = "/upload/";
let btn_start_dn = document.getElementById("btn_start_dn");
btn_start_dn.addEventListener("click", run_speedtest);

function run_speedtest() {
    document.getElementById("result").classList.remove("d-none");
    document.getElementById("message").innerHTML = "Starting download speed test";
    setTimeout(download_speed, 2000);
}

function calculate_speed(start, end, data) {
    let elapsed = (end.getTime() - start.getTime()) / 1000;
    let bps = (data.loaded * 8) / elapsed;
    let mbps = (Math.round(bps/1000000)).toLocaleString();
    return mbps;
}

function errorHandler() {
    document.getElementById("hidden_data").textContent = "";
    btn_start_dn.classList.remove("d-none");
}

function download_speed() {
    let start_time;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                document.getElementById("hidden_data").textContent = this.responseText;
            } else {
                console.error('Download failed.', this.status);
                errorHandler();
            }
        }
    };
    xhttp.onloadstart = function () {
        btn_start_dn.classList.add("d-none");
        document.getElementById("hidden_data").textContent = "";
        start_time = new Date();
    };
    xhttp.onprogress = function(e) {
        if (e.lengthComputable) {
            let end_time = new Date();
            let speed_data = calculate_speed(start_time, end_time, e);
            document.getElementById("dn-speed").innerHTML = speed_data + ' Mbps';
            document.getElementById("dn-time").innerHTML = Math.round(e.loaded / 1000000) + ' MB';
        }
    };
    xhttp.onloadend = function() {
        document.getElementById("message").innerHTML = "Starting upload speed test";
        setTimeout(upload_speed, 3000);
    };
    xhttp.onerror = errorHandler;
    xhttp.open("GET", DOWNLOAD_URL);
    xhttp.send();
}

function upload_speed() {
    let start_time;
    let xhttp = new XMLHttpRequest();
    let form_data  = new FormData();
    let upload_data = new Blob([document.getElementById("hidden_data").textContent], { type: "text/plain" });
    form_data.append("upload_data", upload_data);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                console.log(this.status, this.readyState);
            } else {
                console.error('Upload failed.', this.status);
                errorHandler();
            }
        }
    };
    xhttp.upload.onloadstart = function() {
        start_time = new Date();
    };
    xhttp.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            let end_time = new Date();
            let speed_data = calculate_speed(start_time, end_time, e);
            document.getElementById("up-speed").innerHTML = speed_data + ' Mbps';
            document.getElementById("up-time").innerHTML = Math.round(e.loaded / 1000000) + ' MB';
        }
    };
    xhttp.upload.onloadend = function() {
        document.getElementById("hidden_data").textContent = "";
        btn_start_dn.innerHTML = "Restart Speed Test";
        btn_start_dn.classList.remove("d-none");
    };
    xhttp.upload.onerror = errorHandler;
    xhttp.open("POST", UPLOAD_URL);
    xhttp.send(form_data);
}