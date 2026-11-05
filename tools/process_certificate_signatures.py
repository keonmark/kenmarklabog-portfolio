from pathlib import Path
from shutil import copy2

from PIL import Image, ImageFilter


SOURCE = Path("assets/images/certificates")
DESTINATION = SOURCE / "blurred"

# Region coordinates are proportional to the source image dimensions. The Cisco
# certificates share the same template but have differing pixel dimensions.
REGIONS = {
    "3_Networking Basics.jpg": (0.078, 0.742, 0.276, 0.842),
    "4_Network Support and Security.jpg": (0.078, 0.742, 0.276, 0.842),
    "5_Network Defense.jpg": (0.078, 0.742, 0.276, 0.842),
    "6_Networking Devices and Initial Configuration.jpg": (0.078, 0.742, 0.276, 0.842),
    "7_Network Addressing and Basic Troubleshooting.jpg": (0.078, 0.742, 0.276, 0.842),
    "8_Ethical Hacker.jpg": (0.078, 0.742, 0.276, 0.842),
    "9_Endpoint Security.jpg": (0.078, 0.742, 0.276, 0.842),
    "Al Security Summit 2026 CxO Trust.jpg": (0.333, 0.815, 0.570, 0.877),
    "SPUP OU Cyber Security.jpg": (0.745, 0.725, 0.905, 0.830),
}


def blur_signature(image: Image.Image, region: tuple[float, float, float, float]) -> Image.Image:
    width, height = image.size
    left, top, right, bottom = region
    box = (round(left * width), round(top * height), round(right * width), round(bottom * height))
    signature = image.crop(box)
    # Scale the blur with the source resolution while keeping it strong enough
    # to make handwriting unreadable.
    radius = max(18, round(width * 0.016))
    image.paste(signature.filter(ImageFilter.GaussianBlur(radius=radius)), box)
    return image


def main() -> None:
    DESTINATION.mkdir(parents=True, exist_ok=True)
    for source_path in SOURCE.glob("*.jpg"):
        output_path = DESTINATION / source_path.name
        if source_path.name not in REGIONS:
            copy2(source_path, output_path)
            continue

        with Image.open(source_path) as source_image:
            image = source_image.convert("RGB")
            blur_signature(image, REGIONS[source_path.name])
            image.save(output_path, "JPEG", quality=95, subsampling=0, optimize=True)


if __name__ == "__main__":
    main()
