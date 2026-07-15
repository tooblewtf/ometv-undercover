let apiKey = "";

const panel = document.createElement('div');
panel.style.cssText = `
    position: fixed; 
    top: 20px; 
    right: 20px; 
    width: 440px; 
    background: #0a0a0a;
    color: #ffffff; 
    border: 1px solid #ffffff;
    border-radius: 12px;
    padding: 20px;
    z-index: 99999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14.5px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7),
                0 0 0 1px rgba(255,255,255,0.08) inset;
    user-select: none; 
    cursor: move; 
    overflow: hidden;
    min-height: 280px;
`;

panel.innerHTML = `
    <div id="header" style="margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid #222;display:flex;justify-content:space-between;align-items:center;">
        <strong style="font-size:16px;letter-spacing:0.5px;">OmeTV Uncover</strong>

        <div style="display:flex;gap:8px;align-items:center;">
            <span id="status" style="color:#888;font-size:13px;padding:5px 12px;background:#111;border-radius:9999px;">
                Waiting for connection...
            </span>

            <button id="minBtn" style="width:28px;height:28px;border:none;border-radius:6px;background:#1b1b1b;color:white;cursor:pointer;font-size:18px;">−</button>
            <button id="closeBtn" style="width:28px;height:28px;border:none;border-radius:6px;background:#1b1b1b;color:white;cursor:pointer;font-size:16px;">x</button>
        </div>
    </div>

    <div id="snapshotContainer" style="margin-top:15px; display:none; text-align:center;">
        <img id="snapshotImg" style="width: 220px; height: 220px; object-fit: cover; border-radius:10px; margin-top:8px; border:1px solid #444;">
    </div>

    <div id="info" style="line-height:1.8;min-height:210px;color:#ddd;"></div>
    
`;

document.body.appendChild(panel);

const info = document.getElementById("info");
const minBtn = document.getElementById("minBtn");
const closeBtn = document.getElementById("closeBtn");
const snapshotContainer = document.getElementById("snapshotContainer");
const snapshotImg = document.getElementById("snapshotImg");

let minimized = false;

minBtn.onclick = () => {
    minimized = !minimized;
    if (minimized) {
        info.style.display = "none";
        panel.style.minHeight = "0";
        minBtn.textContent = "+";
    } else {
        info.style.display = "block";
        panel.style.minHeight = "280px";
        minBtn.textContent = "−";
    }
};

closeBtn.onclick = () => panel.remove();

let isDragging = false, offsetX, offsetY;
const header = document.getElementById("header");
header.style.cursor = 'move';

header.addEventListener('mousedown', e => {
    if (e.target.tagName === "BUTTON") return;
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
});

document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    panel.style.left = (e.clientX - offsetX) + "px";
    panel.style.top = (e.clientY - offsetY) + "px";
    panel.style.right = "auto";
});

document.addEventListener('mouseup', () => { isDragging = false; });

window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;
window.RTCPeerConnection = function(...args) {
    const pc = new window.oRTCPeerConnection(...args);
    
    pc.oaddIceCandidate = pc.addIceCandidate;
    pc.addIceCandidate = function(iceCandidate, ...rest) {
        if (iceCandidate?.candidate) {
            const fields = iceCandidate.candidate.split(" ");
            const ip = fields[4];
            const type = fields[7];
            if (ip && type === "srflx" && /^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
                document.getElementById('status').innerHTML = `IP: ${ip}`;
                document.getElementById('status').style.color = '#fff';
                getLocation(ip);
            }
        }
        return pc.oaddIceCandidate(iceCandidate, ...rest);
    };
    return pc;
};

function takeSnapshot() {
    const remoteVideo = getRemoteVideo();
   
    if (!remoteVideo || remoteVideo.readyState < 2) {
        console.log("Video not ready yet, skipping snapshot.");
        return;
    }

    try {
        const videoWidth = remoteVideo.videoWidth;
        const videoHeight = remoteVideo.videoHeight;
        const size = Math.min(videoWidth, videoHeight);
        
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        const xOffset = (videoWidth - size) / 2;
        const yOffset = (videoHeight - size) / 2;

        ctx.drawImage(remoteVideo, xOffset, yOffset, size, size, 0, 0, size, size);

        const dataURL = canvas.toDataURL("image/jpeg", 0.85);

        snapshotImg.src = dataURL;
        snapshotContainer.style.display = "block";


    } catch (err) {
        console.error("Snapshot failed:", err);
    }
}

function getRemoteVideo() {
    return document.querySelector('video#remote-video') ||
           document.querySelector('video:not([muted])') ||
           document.querySelectorAll('video')[1] ||
           document.querySelector('video[autoplay]') ||
           document.querySelector('video');
}

async function getLocation(ip) {
    const infoDiv = document.getElementById('info');
    infoDiv.innerHTML = `<span style="color:#666;">Fetching data...</span>`;
    
    try {
        const res = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`);
        const data = await res.json();

        const html = `
            <strong>IP:</strong> <b>${ip}</b><br>            
            Country: ${data.country_name || 'N/A'}<br>
            Region: ${data.state_prov || 'N/A'}<br>
            City: <b>${data.city || 'N/A'}</b><br>
            ISP: ${data.isp || 'N/A'}<br>
            <strong>Language:</strong> <b>${data.languages || 'Unknown'}</b><br>
            Coords: ${data.latitude}, ${data.longitude}<br><br>
            
            <strong>TIMEZONE</strong><br>
            Zone: ${data.time_zone?.name || 'N/A'}<br>
            Current Time: ${data.time_zone?.current_time || 'N/A'}<br>
            Offset: UTC${data.time_zone?.offset || ''}<br><br>
            
            <span style="color:#555; font-size:12.5px;">Updated just now</span>
        `;
        infoDiv.innerHTML = html;
        
        const wait = setInterval(() => {
        const video = getRemoteVideo();
        
        if (video && video.readyState >= 2) {
            clearInterval(wait);
            takeSnapshot();
        }
    }, 100);

    } catch (e) {
        infoDiv.innerHTML = `<span style="color:#555;">Failed to fetch data</span>`;
    }
}


console.log("%cOmeTV Uncover", "color:#555; font-size:15px;");
