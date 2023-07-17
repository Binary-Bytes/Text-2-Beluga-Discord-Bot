import os
import string
import random
import time
import sys
import requests
import shutil

def gen_vid(file_url, folder):
    input_folder = folder
    image_files = sorted([f for f in os.listdir(input_folder) if f.endswith('.png')])

    durations = []
    with requests.get(file_url) as response:
        if response.status_code == 200:
            lines = response.text.splitlines()
            name_up_next = True
            for line in lines:
                if line == '':
                    name_up_next = True
                    continue
                elif line[0] == '#' and not line[1] == '!':
                    continue
                elif name_up_next:
                    name_up_next = False
                    continue
                else:
                    try:
                        durations.append(line.split('$^')[1])
                    except:
                        shutil.rmtree(input_folder, ignore_errors=True)
                        print('[err] Invalid file content! Each message line should contain `$^` in the end (followed by duration)')
                        exit()
        else:
            print(f"Error downloading file: {response.status_code}")
            exit()
    
    # Create a text file to store the image paths
    rand = ''.join(random.choice(string.ascii_letters) for _ in range(10))
    image_paths = f'{input_folder}/{rand}.txt'
    with open(image_paths, 'w') as file:    
        count = 0
        for image_file in image_files:
            file.write(f"file '{image_file}'\noutpoint {durations[count]}\n")
            count += 1

    video_width = 1280
    video_height = 720

    # Generate the video using the text file containing image paths and calculated frame rate
    os.system(f"ffmpeg -f concat -i {image_paths} -vcodec libx264 -crf 25 -vf 'scale={video_width}:{video_height}:force_original_aspect_ratio=decrease,pad={video_width}:{video_height}:(ow-iw)/2:(oh-ih)/2' -pix_fmt yuv420p -preset ultrafast -tune stillimage {input_folder}/output.mp4")
    
    time.sleep(2)
    print(input_folder)
