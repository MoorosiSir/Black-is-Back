
from pathlib import Path
from PIL import Image, ImageOps
import shutil
import sys

# ============================================================
# BIB IMAGE OPTIMIZER
# Black Is Back Projects
# ============================================================

# ------------------------------------------------------------
# PROJECT PATHS
# ------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent

ORIGINALS = PROJECT_ROOT / "docs" / "assets" / "Images" / "Originals"
WEB = PROJECT_ROOT / "docs" / "assets" / "Images" / "Web"


# ------------------------------------------------------------
# WEBSITE IMAGE REQUIREMENTS
# ------------------------------------------------------------

MAX_WIDTH = 1600
MAX_HEIGHT = 1600

# Maximum acceptable file size for an image that is
# already WebP and does not need recompression.
MAX_WEBP_SIZE = 600 * 1024  # 600 KB

# Quality used when an image actually needs conversion
# or re-optimization.
WEBP_QUALITY = 82


# ------------------------------------------------------------
# SUPPORTED IMAGE FORMATS
# ------------------------------------------------------------

SUPPORTED_FORMATS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
    ".tif",
    ".tiff",
}


# ------------------------------------------------------------
# FORCE MODE
# ------------------------------------------------------------

FORCE = "--force" in sys.argv


# ------------------------------------------------------------
# FILE SIZE FORMATTER
# ------------------------------------------------------------

def format_size(size):
    """Return a readable file size."""

    if size < 1024:
        return f"{size} B"

    if size < 1024 * 1024:
        return f"{size / 1024:.0f} KB"

    return f"{size / (1024 * 1024):.2f} MB"


# ------------------------------------------------------------
# CHECK IF WEBP IS ALREADY SUITABLE
# ------------------------------------------------------------

def is_already_optimized_webp(source):
    """
    Check whether an existing WebP already meets our website
    requirements and therefore should NOT be recompressed.
    """

    try:

        with Image.open(source) as image:

            width, height = image.size

            # Check dimensions.
            dimensions_ok = (
                width <= MAX_WIDTH
                and height <= MAX_HEIGHT
            )

            # Check file size.
            size_ok = (
                source.stat().st_size <= MAX_WEBP_SIZE
            )

            # Check EXIF orientation.
            #
            # If orientation is anything other than normal,
            # we should process the image so the rotation is
            # physically applied to the pixels.
            orientation = image.getexif().get(274, 1)

            orientation_ok = orientation == 1

            return (
                dimensions_ok
                and size_ok
                and orientation_ok
            )

    except Exception:
        return False


# ------------------------------------------------------------
# OPTIMIZE IMAGE
# ------------------------------------------------------------

def optimize_image(source, output_file):
    """Convert or re-optimize an image into WebP."""

    try:

        with Image.open(source) as image:

            # ------------------------------------------------
            # 1. Correct phone/camera orientation
            # ------------------------------------------------

            image = ImageOps.exif_transpose(image)

            original_width, original_height = image.size

            # ------------------------------------------------
            # 2. Handle image mode
            # ------------------------------------------------

            if image.mode in ("RGBA", "LA"):

                image = image.convert("RGBA")

            elif image.mode == "P":

                if "transparency" in image.info:
                    image = image.convert("RGBA")
                else:
                    image = image.convert("RGB")

            else:

                image = image.convert("RGB")

            # ------------------------------------------------
            # 3. Resize if necessary
            # ------------------------------------------------

            image.thumbnail(
                (MAX_WIDTH, MAX_HEIGHT),
                Image.Resampling.LANCZOS
            )

            new_width, new_height = image.size

            # ------------------------------------------------
            # 4. Save as WebP
            # ------------------------------------------------

            save_options = {
                "format": "WEBP",
                "quality": WEBP_QUALITY,
                "method": 6,
            }

            # Preserve transparency where necessary.
            if image.mode == "RGBA":
                save_options["lossless"] = False

            image.save(
                output_file,
                **save_options
            )

            # ------------------------------------------------
            # 5. File sizes
            # ------------------------------------------------

            original_size = source.stat().st_size
            new_size = output_file.stat().st_size

            saved = original_size - new_size

            if original_size > 0:

                percentage = (
                    saved / original_size
                ) * 100

            else:

                percentage = 0

            # ------------------------------------------------
            # 6. Report
            # ------------------------------------------------

            print(f"\n✓ {source.name}")

            print(
                f"  Optimized:"
                f" {format_size(original_size)}"
                f" →"
                f" {format_size(new_size)}"
            )

            print(
                f"  Dimensions:"
                f" {original_width} × {original_height}"
                f" →"
                f" {new_width} × {new_height}"
            )

            if saved >= 0:

                print(
                    f"  Saved:"
                    f" {percentage:.1f}%"
                )

            else:

                print(
                    f"  Output is"
                    f" {abs(percentage):.1f}% larger"
                )

            print(
                f"  Output:"
                f" {output_file.name}"
            )

            return True

    except Exception as error:

        print(f"\n✗ Could not process {source.name}")
        print(f"  Error: {error}")

        return False


# ------------------------------------------------------------
# COPY ALREADY-OPTIMIZED WEBP
# ------------------------------------------------------------

def copy_optimized_webp(source, output_file):
    """
    Copy an already-good WebP without recompressing it.
    This preserves its existing image quality.
    """

    try:

        shutil.copy2(source, output_file)

        print(f"\n✓ {source.name}")

        print(
            "  Already optimized"
        )

        print(
            "  Copied without recompression"
        )

        print(
            f"  Size: {format_size(source.stat().st_size)}"
        )

        print(
            f"  Output: {output_file.name}"
        )

        return True

    except Exception as error:

        print(f"\n✗ Could not copy {source.name}")
        print(f"  Error: {error}")

        return False


# ------------------------------------------------------------
# MAIN PROGRAM
# ------------------------------------------------------------

def main():

    print("=" * 60)
    print(" BIB IMAGE OPTIMIZER")
    print(" Black Is Back Projects")
    print("=" * 60)

    print(
        f"\nMaximum dimensions:"
        f" {MAX_WIDTH} × {MAX_HEIGHT}"
    )

    print(
        f"Maximum existing WebP size:"
        f" {format_size(MAX_WEBP_SIZE)}"
    )

    print(
        f"Conversion quality:"
        f" {WEBP_QUALITY}"
    )

    if FORCE:

        print(
            "\nFORCE MODE:"
            " Existing optimized images will be"
            " reprocessed."
        )

    # --------------------------------------------------------
    # Make sure folders exist
    # --------------------------------------------------------

    ORIGINALS.mkdir(
        parents=True,
        exist_ok=True
    )

    WEB.mkdir(
        parents=True,
        exist_ok=True
    )

    # --------------------------------------------------------
    # Find supported images
    # --------------------------------------------------------

    images = sorted(
        file
        for file in ORIGINALS.iterdir()
        if file.is_file()
        and file.suffix.lower() in SUPPORTED_FORMATS
    )

    # --------------------------------------------------------
    # Nothing to process
    # --------------------------------------------------------

    if not images:

        print("\nNo supported images found.")

        print(
            "\nPut your original images here:"
        )

        print(ORIGINALS)

        return

    # --------------------------------------------------------
    # Statistics
    # --------------------------------------------------------

    optimized_count = 0
    copied_count = 0
    skipped_count = 0
    failed_count = 0

    total_original = 0
    total_web = 0

    # --------------------------------------------------------
    # Process images
    # --------------------------------------------------------

    print(
        f"\nFound {len(images)} image(s)."
    )

    for source in images:

        output_file = (
            WEB / f"{source.stem}.webp"
        )

        source_size = source.stat().st_size

        # ----------------------------------------------------
        # 1. Already-good WebP
        # ----------------------------------------------------

        if (
            source.suffix.lower() == ".webp"
            and not FORCE
            and is_already_optimized_webp(source)
        ):

            # If the Web version already exists and is newer
            # than the original, there is nothing to do.
            if (
                output_file.exists()
                and output_file.stat().st_mtime
                >= source.stat().st_mtime
            ):

                print(
                    f"\n→ {source.name}"
                )

                print(
                    "  Already in Web folder"
                    " and up to date"
                )

                print(
                    "  Skipped"
                )

                skipped_count += 1

                total_original += source_size
                total_web += output_file.stat().st_size

                continue

            # Otherwise copy it without recompression.
            if copy_optimized_webp(
                source,
                output_file
            ):

                copied_count += 1

                total_original += source_size
                total_web += output_file.stat().st_size

            else:

                failed_count += 1

            continue

        # ----------------------------------------------------
        # 2. Existing output is newer than source
        # ----------------------------------------------------

        if (
            output_file.exists()
            and not FORCE
            and output_file.stat().st_mtime
            >= source.stat().st_mtime
        ):

            print(
                f"\n→ {source.name}"
            )

            print(
                "  Web version already exists"
                " and is up to date"
            )

            print(
                "  Skipped"
            )

            skipped_count += 1

            total_original += source_size
            total_web += output_file.stat().st_size

            continue

        # ----------------------------------------------------
        # 3. Process image
        # ----------------------------------------------------

        if optimize_image(
            source,
            output_file
        ):

            optimized_count += 1

            total_original += source_size
            total_web += output_file.stat().st_size

        else:

            failed_count += 1

    # --------------------------------------------------------
    # Final report
    # --------------------------------------------------------

    print("\n" + "=" * 60)
    print(" OPTIMIZATION COMPLETE")
    print("=" * 60)

    print(
        f"\nOptimized: {optimized_count}"
    )

    print(
        f"Copied unchanged: {copied_count}"
    )

    print(
        f"Skipped: {skipped_count}"
    )

    print(
        f"Failed: {failed_count}"
    )

    print(
        f"\nOriginal total:"
        f" {format_size(total_original)}"
    )

    print(
        f"Web total:"
        f" {format_size(total_web)}"
    )

    if total_original > 0:

        total_saved = (
            (total_original - total_web)
            / total_original
        ) * 100

        if total_saved >= 0:

            print(
                f"Total saved:"
                f" {total_saved:.1f}%"
            )

        else:

            print(
                f"Total increase:"
                f" {abs(total_saved):.1f}%"
            )

    print(
        "\nWebsite images are in:"
    )

    print(WEB)


# ------------------------------------------------------------
# RUN
# ------------------------------------------------------------

if __name__ == "__main__":
    main()