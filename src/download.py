import sys
import os
from yt_dlp import YoutubeDL

def main():
    if len(sys.argv) < 3:
        print("Usage: download.py <url> <output_folder>")
        sys.exit(1)
    
    url = sys.argv[1]
    output_folder = sys.argv[2]
    output_template = os.path.join(output_folder, '%(title)s.%(ext)s')
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_template,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }
    
    try:
        with YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except Exception as e:
        print(f"Error during download: {e}")
        sys.exit(1)
    
    sys.exit(0)

if __name__ == "__main__":
    main()
