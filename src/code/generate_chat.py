from PIL import Image, ImageFont, ImageDraw 
from pilmoji import Pilmoji
import sys
import datetime
import os
import json
import random
import string
import requests
import shutil
from compile_video import *

# CONSTANTS
WORLD_WIDTH = 1777
WORLD_Y_INIT = 231
WORLD_DY = 80

WORLD_HEIGHTS = [WORLD_Y_INIT + i * WORLD_DY for i in range(5)] # for how many messages there are
WORLD_COLOR = (54,57,63,255)

PROFPIC_WIDTH = 120
PROFPIC_POSITION = (36,45)

NAME_FONT_SIZE = 50
TIME_FONT_SIZE = 30
MESSAGE_FONT_SIZE = 50
TIME_FONT_COLOR = (180,180,180)
MESSAGE_FONT_COLOR = (220,220,220)
NAME_POSITION = (190,53)
TIME_POSITION_Y = 67 # x to be determined from name length
NAME_TIME_SPACING = 25
MESSAGE_X = 190
MESSAGE_Y_INIT = 130
MESSAGE_DY = 80
MESSAGE_POSITIONS = [(MESSAGE_X, MESSAGE_Y_INIT + i * MESSAGE_DY) for i in range(5)]

FOLDER_NAME = ''.join(random.choice(string.ascii_letters) for _ in range(10))

# Text fonts
name_font = ImageFont.truetype('src/code/fonts/whitneymedium.otf', NAME_FONT_SIZE)
time_font = ImageFont.truetype('src/code/fonts/whitneymedium.otf', TIME_FONT_SIZE)
message_font = ImageFont.truetype('src/code/fonts/whitneybook.otf', MESSAGE_FONT_SIZE)

# Profile picture dictionary
with open('src/code/profile_pictures/profile_pic_dict.json') as file:
    profile_pic_dict = json.loads(file.read())

# Role colors dictionary
with open('src/code/profile_pictures/role_colors.json') as file:
    role_colors = json.loads(file.read())

def generate_chat(messages, name, time, profpic_file, color):
    name_text = name
    time_text = f'Today at {time} PM'
    time_position = (NAME_POSITION[0] + name_font.getlength(name) + NAME_TIME_SPACING, TIME_POSITION_Y)
    
    # Open profile picture
    prof_pic = Image.open(profpic_file)
    prof_pic.thumbnail([sys.maxsize, PROFPIC_WIDTH], Image.Resampling.LANCZOS)
    
    # Create profile picture mask
    mask = Image.new("L", prof_pic.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse([(0, 0), (PROFPIC_WIDTH, PROFPIC_WIDTH)], fill=255)
    
    # Create template and draw on template
    template = Image.new(mode='RGBA', size=(WORLD_WIDTH, WORLD_HEIGHTS[len(messages)-1]), color=WORLD_COLOR)
    template.paste(prof_pic, PROFPIC_POSITION, mask)
    template_editable = ImageDraw.Draw(template)
    template_editable.text(NAME_POSITION, name_text, color, font=name_font)
    template_editable.text(time_position, time_text, TIME_FONT_COLOR, font=time_font)
    
    for i, message in enumerate(messages):
        with Pilmoji(template) as pilmoji:
            pilmoji.text(MESSAGE_POSITIONS[i], message.strip(), MESSAGE_FONT_COLOR, font=message_font)
            
    return template

def save_images(lines, init_time, dt=30):
    os.system(f'mkdir {FOLDER_NAME}')
    
    name_up_next = True # first line starts with name
    current_time = init_time
    current_name = None
    current_lines = []
    msg_number = 1
    
    for line in lines:
        # If line is empty (signifying end of message chain)
        if line == '':
            name_up_next=True
            current_lines = []
            continue
        
        # lines that are commented out
        if line[0] == '#':
            continue
        
        # If currently on a name line
        if name_up_next:
            if line.endswith(':'):
                current_name = line.split(':')[0]
            else:
                shutil.rmtree(FOLDER_NAME, ignore_errors=True)
                print('[err] Invalid file content! Each line with name should contain `:` in the end')
                exit()
            name_up_next = False
            continue
        
        # otherwise append message
        try:
            current_lines.append(line.split('$^')[0])
        except:
            shutil.rmtree(FOLDER_NAME, ignore_errors=True)
            print('[err] Invalid file content! Each message line should contain `$^` in the end (followed by duration)')
            exit()

        try:
            image = generate_chat(messages=current_lines,
                                  name=current_name,
                                  time=f'{current_time.hour % 12}:{current_time.minute}',
                                  profpic_file=f'src/code/profile_pictures/{profile_pic_dict[current_name]}',
                                  color=role_colors[current_name])
        except:
            shutil.rmtree(FOLDER_NAME, ignore_errors=True)
            print(f'[err] Invalid name used (`{current_name}`)!')
            exit()
                
        image.save(f'{FOLDER_NAME}/{msg_number:03d}.png')
        
        # update time and msg_number for saving
        current_time += datetime.timedelta(0, dt)
        msg_number += 1


if __name__ == '__main__':
    lines = ''
    with requests.get(sys.argv[1]) as response:
        if response.status_code == 200:
            lines = response.text.splitlines()
        
    current_time = datetime.datetime.now()
    save_images(lines, init_time=current_time)
    gen_vid(sys.argv[1], FOLDER_NAME)
