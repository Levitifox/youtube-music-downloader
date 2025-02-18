# YouTube Music Downloader

A desktop application for downloading music from YouTube, built with Electron, React, and Python.

## Features

- **Download YouTube Videos:** Extract high-quality audio from YouTube videos.
- **MP3 Conversion:** Automatically converts downloads to MP3 format with metadata support.
- **Cross-Platform:** Compatible with Windows, macOS, and Linux.

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **FFmpeg:** Must be installed and added to your system PATH.
- **yt-dlp:** This will be installed automatically with the Python dependencies.

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/Levitifox/youtube-music-downloader
    cd youtube-music-downloader
    ```

2. **Install Python dependencies:**

    ```sh
    pip install yt-dlp mutagen
    ```

3. **Install Node.js dependencies:**
    ```sh
    npm install
    ```

## Usage

### Development Mode

1. **Start the Parcel development server:**

    ```sh
    npm run watch
    ```

2. **Run the Electron app:**
   In another terminal, execute:
    ```sh
    npm start
    ```

### Production Build

To create a packaged application:

```sh
npm run build
```

## Acknowledgements

- **Electron:** For providing a platform to build cross-platform desktop applications.
- **React:** For a robust and efficient UI library.
- **yt-dlp:** For the reliable extraction and download of YouTube content.
- **Lottie:** For enhancing the user experience with smooth animations.
