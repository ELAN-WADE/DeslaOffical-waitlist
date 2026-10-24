import os
from PIL import Image

output_dir = r"c:\Users\HP\Desktop\New folder (2)\public\products"
os.makedirs(output_dir, exist_ok=True)

images = [
    (r"C:\Users\HP\.gemini\antigravity-ide\brain\55b36bfe-d41d-49ba-bba4-2f805c7912b3\delsla_serum_bottle_1791013657843.jpg", "serum.png"),
    (r"C:\Users\HP\.gemini\antigravity-ide\brain\55b36bfe-d41d-49ba-bba4-2f805c7912b3\delsla_velvet_lipstick_1791013706655.jpg", "lipstick.png"),
    (r"C:\Users\HP\.gemini\antigravity-ide\brain\55b36bfe-d41d-49ba-bba4-2f805c7912b3\delsla_barrier_cream_1791014640678.jpg", "cream.png"),
    (r"C:\Users\HP\.gemini\antigravity-ide\brain\55b36bfe-d41d-49ba-bba4-2f805c7912b3\delsla_parfum_flacon_1791014670876.jpg", "parfum.png"),
]

for src_path, out_name in images:
    if not os.path.exists(src_path):
        print(f"Skipping {src_path} (not found)")
        continue
    img = Image.open(src_path).convert("RGBA")
    datas = img.getdata()

    # Smart background removal for pure/near-white studio backdrop
    # Preserve dark pixels and colors, feather out pure white/light gray backdrop
    new_data = []
    for item in datas:
        r, g, b, a = item
        # If very close to white (brightness threshold)
        brightness = (r + g + b) / 3.0
        # If background is bright white
        if r > 242 and g > 242 and b > 242:
            # Smooth feathering from 242 to 255
            diff = max(0, 255 - brightness)
            alpha = int(diff * (255.0 / 13.0))
            if alpha < 10:
                new_data.append((r, g, b, 0))
            else:
                new_data.append((r, g, b, alpha))
        elif r > 230 and g > 230 and b > 230 and abs(r - g) < 8 and abs(g - b) < 8:
            # Very light neutral gray shadow transition
            diff = 255 - brightness
            alpha = int(diff * 5)
            alpha = min(255, max(0, alpha))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append(item)

    img.putdata(new_data)
    out_path = os.path.join(output_dir, out_name)
    img.save(out_path, "PNG")
    print(f"Successfully processed and saved transparent: {out_path}")
