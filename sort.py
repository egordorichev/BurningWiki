import requests
from PIL import Image
import urllib.request
import colorsys

link = "https://api.github.com/repos/egordorichev/BurningWiki/contents/data/images"

r = requests.get(link)
data = r.json()

gen_json = "{\n"

def rgb(img):
    r, g, b = 0, 0, 0
    count = 0
    for x in range(img.size[0]):
        for y in range(img.size[1]):
            rgb_ver = img.convert("RGB")
            temp_r, temp_g, temp_b = rgb_ver.getpixel((x, y))
            r += temp_r
            g += temp_g
            b += temp_b
            count += 1 
    return [(r/count), (g/count), (b/count), count]

l = len(data)
for i in range(l):
    item = data[i]
    if item["name"][-3:] == "png":
        print(item["name"])
        image = Image.open(urllib.request.urlopen(item["download_url"]))
        image_data = image.load()
        rgb_data = rgb(image)
        hls = colorsys.rgb_to_hls(rgb_data[0], rgb_data[1], rgb_data[2])
        
        gen_json += "\"" + item["name"][:-4] + "\": " + str(hls[0])
        if i == l - 1:
            gen_json += "\n"
        else:
            gen_json += ",\n"

gen_json += "}"
f = open("data/color.json","w+")
f.write(gen_json)
f.close()
