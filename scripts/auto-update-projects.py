#!/usr/bin/env python3
"""
Auto-Update Script for Project Gallery
Scans the project gallery photo folder and updates the JSON data file
"""

import os
import json
from pathlib import Path
import shutil
from datetime import datetime

# Configuration
PROJECT_GALLERY_FOLDER = "/Users/parthgupta/Desktop/code_somya/project gallery photo"
WEBSITE_ASSETS_FOLDER = "/Users/parthgupta/Desktop/code_somya/8arts_website/assets"
JSON_OUTPUT_FILE = "/Users/parthgupta/Desktop/code_somya/8arts_website/data/project-gallery.json"

def scan_project_gallery():
    """Scan the project gallery folder and extract all project data"""
    print("🚀 Starting Project Gallery Auto-Update")
    print(f"📂 Scanning folder: {PROJECT_GALLERY_FOLDER}")
    print(f"🎯 Output to: {JSON_OUTPUT_FILE}")
    print("--------------------------------------------------")

    project_data = []
    project_gallery_path = Path(PROJECT_GALLERY_FOLDER)

    if not project_gallery_path.exists() or not project_gallery_path.is_dir():
        print(f"❌ Project gallery folder not found: {PROJECT_GALLERY_FOLDER}\n")
        return []

    for photo_folder in sorted(os.listdir(project_gallery_path)):
        photo_path = project_gallery_path / photo_folder
        if not photo_path.is_dir() or photo_folder.startswith('.'):
            continue

        print(f"📸 Processing project: {photo_folder}")

        # Find image file
        image_file = None
        story_file = None

        for file in os.listdir(photo_path):
            file_path = os.path.join(photo_path, file)
            file_ext = os.path.splitext(file)[1].lower()

            if file_ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic']:
                image_file = file
            elif file_ext == '.txt':
                story_file = file

        if image_file:
            # Read story content if available
            if story_file:
                story_path = os.path.join(photo_path, story_file)
                try:
                    with open(story_path, 'r', encoding='utf-8') as f:
                        story_lines = f.read().strip().split('\n')
                        # First line is the title
                        story_title = story_lines[0].strip() if story_lines else f"Project {photo_folder.replace('photo', '')}"
                        # Rest of the content is the description
                        story_content = '\n'.join(story_lines[1:]).strip() if len(story_lines) > 1 else "No description available"
                except:
                    story_title = f"Project {photo_folder.replace('photo', '')}"
                    story_content = "No description available"
            else:
                story_title = f"Project {photo_folder.replace('photo', '')}"
                story_content = f"Project {photo_folder.replace('photo', '')} - Add your story in a .txt file"

            # Copy image to website assets
            source_image = os.path.join(photo_path, image_file)
            image_ext = os.path.splitext(image_file)[1]

            # Convert HEIC to JPG if needed
            if image_ext.lower() == '.heic':
                new_image_name = f"project_{photo_folder}.jpg"
                dest_image = os.path.join(WEBSITE_ASSETS_FOLDER, new_image_name)

                try:
                    # Convert HEIC to JPG using sips (macOS built-in)
                    print(f"  {source_image}")
                    print(f"  {dest_image}")
                    os.system(f'sips -s format jpeg "{source_image}" --out "{dest_image}"')
                    print(f"    ✅ Converted HEIC to JPG: {new_image_name}")
                except Exception as e:
                    print(f"    ❌ Failed to convert HEIC: {e}")
                    continue
            else:
                new_image_name = f"project_{photo_folder}{image_ext}"
                dest_image = os.path.join(WEBSITE_ASSETS_FOLDER, new_image_name)

                try:
                    shutil.copy2(source_image, dest_image)
                    print(f"    ✅ Copied image: {new_image_name}")
                except Exception as e:
                    print(f"    ❌ Failed to copy image: {e}")
                    continue

            # Create project item
            project_item = {
                "id": f"project_{photo_folder}",
                "title": story_title,
                "description": story_content,
                "image": f"assets/{new_image_name}",
                "meta": f"Project • {datetime.now().strftime('%Y')}"
            }

            project_data.append(project_item)
            print(f"    ✅ Added to project data")
        else:
            print(f"    ⚠️  Missing image or story file in {photo_folder}")

    print(f"\n📊 Found {len(project_data)} project items")

    # Write to JSON file
    try:
        with open(JSON_OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(project_data, f, indent=2, ensure_ascii=False)
        print(f"✅ Updated JSON file: {JSON_OUTPUT_FILE}\n")
    except Exception as e:
        print(f"❌ Failed to write JSON file: {e}\n")

    return project_data

if __name__ == "__main__":
    scan_project_gallery()
    print("🎉 Successfully updated project gallery!")
    print("🔄 Refresh your website to see the changes\n")
    print("==================================================")
    print("✨ Auto-update complete!")
