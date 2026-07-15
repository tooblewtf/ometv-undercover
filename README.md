# OmeTV Uncover
OmeTV Uncover is a JavaScript userscript that detects the remote peer's public IP address via WebRTC and enriches it with geolocation data using the IPGeolocation API. It also captures a snapshot of the remote video stream and presents all information in a modern draggable UI.

> **Disclaimer**
>
> This project displays approximate IP-based geolocation using publicly available network information. The reported location is an estimate and should not be considered the user's exact physical location.

---

## Features

* IP-based geolocation
* Country, region, and city information
* ISP detection
* Timezone details
* Automatic remote video snapshot
* Draggable interface
* Minimize and close controls
* Lightweight and fast

---

## Requirements

* A modern Chromium-based browser
* An IPGeolocation API key
* An OmeTV account

---

## Setup Guide

### 1. Create an IPGeolocation account

Visit **https://ipgeolocation.io/** and create a free account.

### 2. Copy your API key

After signing in, open your dashboard and copy your API key.

<p align="center">
  <img src="https://github.com/user-attachments/assets/87fa9f6e-3ac6-4721-b5bb-2ccbd2240d0a" alt="IPGeolocation API Key" width="900">
</p>

### 3. Configure the script

Replace:

```text
let apiKey = "";
```

with:

```text
let apiKey = "YOUR_API_KEY";
```

### 4. Open OmeTV

Go to **https://ome.tv/** and sign in.

### 5. Open Developer Tools

Press **F12** or **Ctrl + Shift + I**.

### 6. Open the Console

Select the **Console** tab.

If Chrome displays:

> Warning: Don't paste code into the DevTools Console...

type:

```text
allow pasting
```

and press **Enter**.

### 7. Run the script

Paste the entire script into the Console and press **Enter**.

### 8. Start using OmeTV Uncover

Once connected to another user, the floating panel will automatically display the available information.

---

## Information Displayed

* Public IP address
* Country
* Region / State
* City
* ISP
* Languages
* Latitude & Longitude
* Timezone
* Current local time
* UTC Offset
* Remote video snapshot

---

## How It Works

The script monitors the WebRTC connection used by OmeTV to detect the remote peer's public IP address. It then queries the IPGeolocation API to retrieve approximate geolocation data and displays it in a floating interface.

When the remote video stream becomes available, the script automatically captures a square snapshot and displays it inside the panel.

---

## License

This project is licensed under the MIT License.

---

<h1 align="center">DISCLAIMER</h1>

<h4 align="center">
I'm not responsible for anything you do with this program. Please use it only for legal, ethical, and educational purposes. You are solely responsible for complying with applicable laws and the OmeTV Terms of Service.
</h4>
