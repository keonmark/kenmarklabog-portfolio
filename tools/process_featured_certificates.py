"""Regenerate the two featured certificate display images from the originals.

The originals (NC2.jpg, ITS-CERT.jpg) are opened read-only and never modified.
Each sensitive region is irreversibly pixelated (area-average downsample,
nearest-neighbour upscale) and then Gaussian-blurred, so the underlying values
cannot be recovered from the exported pixels. Everything else — QR code,
seals, logos, printed signatures, names, dates — is passed through untouched.

Regions are exact pixel boxes for these two fixed-size sources:

* TESDA NC II (2114x3008)
    - Certificate Number value, right of its label
    - ULI block directly below the label
    - CLN-NQ number beneath the QR code
  The QR code itself is deliberately NOT touched.
* Certiport ITS (4320x3340)
    - Personal handwritten signature above the printed name block
"""

from pathlib import Path

from PIL import Image, ImageFilter

SOURCE = Path("assets/images/certificates")
FEATURED = SOURCE / "featured"

# (left, upper, right, lower) in source pixels.
TESDA_REGIONS = [
    (578, 2236, 895, 2312),  # Certificate Number value
    (330, 2294, 890, 2362),  # ULI block (right edge reaches x=882)
    (292, 2752, 686, 2808),  # CLN-NQ number (QR panel ends at y=2736)
]
ITS_REGIONS = [
    (280, 2085, 1295, 2410),  # handwritten signature (rule line at y=2417)
]


def redact(image: Image.Image, box: tuple, block: int, blur_radius: int) -> None:
    """Irreversibly pixelate and blur one rectangular region in place."""
    region = image.crop(box)
    width, height = region.size
    factors_x = max(1, round(width / block))
    factors_y = max(1, round(height / block))
    # Area averaging collapses every glyph stroke into a single mean colour;
    # the upscale and blur leave no recoverable structure behind.
    averaged = region.resize((factors_x, factors_y), Image.BOX)
    mosaic = averaged.resize((width, height), Image.NEAREST)
    mosaic = mosaic.filter(ImageFilter.GaussianBlur(blur_radius))
    image.paste(mosaic, box)


def process(source: Path, destination: Path, regions: list, block: int, blur_radius: int) -> None:
    with Image.open(source) as original:
        original.load()
        image = original.convert("RGB")
    for box in regions:
        redact(image, box, block, blur_radius)
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "JPEG", quality=95, subsampling=0)
    print(f"{destination} {image.size} written from {source.name}")


def main() -> None:
    process(SOURCE / "NC2.jpg", FEATURED / "Computer_Systems_Servicing_NC_II.jpg",
            TESDA_REGIONS, block=36, blur_radius=12)
    process(SOURCE / "ITS-CERT.jpg", FEATURED / "ITS_Networking.jpg",
            ITS_REGIONS, block=40, blur_radius=14)


if __name__ == "__main__":
    main()
