#!/usr/bin/env python3
"""
Auto-Update Featured Series Script
Scans the featured_series folder and automatically updates the website
"""

import os
import json
import glob
from pathlib import Path
import shutil
from datetime import datetime

# Configuration
FEATURED_SERIES_FOLDER = "/Users/parthgupta/Desktop/code_somya/featured series"
WEBSITE_ASSETS_FOLDER = "/Users/parthgupta/Desktop/code_somya/8arts_website/assets"
JSON_OUTPUT_FILE = "/Users/parthgupta/Desktop/code_somya/8arts_website/data/featured-series.json"

def scan_featured_series():
    """Scan the featured_series folder and extract all series data"""
    series_data = []
    
    if not os.path.exists(FEATURED_SERIES_FOLDER):
        print(f"❌ Featured series folder not found: {FEATURED_SERIES_FOLDER}")
        return series_data
    
    # Scan each series folder (s1, s2, s3, etc.)
    for series_folder in sorted(os.listdir(FEATURED_SERIES_FOLDER)):
        series_path = os.path.join(FEATURED_SERIES_FOLDER, series_folder)
        
        if not os.path.isdir(series_path):
            continue
            
        print(f"📁 Scanning series: {series_folder}")
        
        # Scan each photo folder (p1, p2, p3, etc.)
        for photo_folder in sorted(os.listdir(series_path)):
            photo_path = os.path.join(series_path, photo_folder)
            
            if not os.path.isdir(photo_path):
                continue
                
            print(f"  📸 Processing photo: {photo_folder}")
            
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
                            story_title = story_lines[0].strip() if story_lines else f"Series {series_folder.replace('s', '')} - Photo {photo_folder.replace('p', '')}"
                            # Rest of the content is the description
                            story_content = '\n'.join(story_lines[1:]).strip() if len(story_lines) > 1 else "No description available"
                    except:
                        story_title = f"Series {series_folder.replace('s', '')} - Photo {photo_folder.replace('p', '')}"
                        story_content = "No description available"
                else:
                    story_title = f"Series {series_folder.replace('s', '')} - Photo {photo_folder.replace('p', '')}"
                    story_content = f"Series {series_folder.replace('s', '')} - Photo {photo_folder.replace('p', '')} - Add your story in a .txt file"
                
                # Copy image to website assets
                source_image = os.path.join(photo_path, image_file)
                image_ext = os.path.splitext(image_file)[1]
                
                # Convert HEIC to JPG if needed
                if image_ext.lower() == '.heic':
                    new_image_name = f"{series_folder}_{photo_folder}.jpg"
                    dest_image = os.path.join(WEBSITE_ASSETS_FOLDER, new_image_name)
                    
                    try:
                        # Convert HEIC to JPG using sips (macOS built-in)
                        os.system(f'sips -s format jpeg "{source_image}" --out "{dest_image}"')
                        print(f"    ✅ Converted HEIC to JPG: {new_image_name}")
                    except Exception as e:
                        print(f"    ❌ Failed to convert HEIC: {e}")
                        continue
                else:
                    new_image_name = f"{series_folder}_{photo_folder}{image_ext}"
                    dest_image = os.path.join(WEBSITE_ASSETS_FOLDER, new_image_name)
                    
                    try:
                        shutil.copy2(source_image, dest_image)
                        print(f"    ✅ Copied image: {new_image_name}")
                    except Exception as e:
                        print(f"    ❌ Failed to copy image: {e}")
                        continue
                
                # Create series item
                series_item = {
                    "id": f"{series_folder}_{photo_folder}",
                    "title": story_title,
                    "description": story_content,
                    "image": f"assets/{new_image_name}",
                    "meta": f"Series {series_folder.replace('s', '')} • {datetime.now().strftime('%Y')}"
                }
                
                series_data.append(series_item)
                print(f"    ✅ Added to series data")
            else:
                print(f"    ⚠️  Missing image or story file in {photo_folder}")
    
    return series_data

def update_json_file(series_data):
    """Update the JSON file with new series data"""
    try:
        with open(JSON_OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(series_data, f, indent=2, ensure_ascii=False)
        print(f"✅ Updated JSON file: {JSON_OUTPUT_FILE}")
        return True
    except Exception as e:
        print(f"❌ Failed to update JSON file: {e}")
        return False

def main():
    """Main function"""
    print("🚀 Starting Featured Series Auto-Update")
    print(f"📂 Scanning folder: {FEATURED_SERIES_FOLDER}")
    print(f"🎯 Output to: {JSON_OUTPUT_FILE}")
    print("-" * 50)
    
    # Ensure assets folder exists
    os.makedirs(WEBSITE_ASSETS_FOLDER, exist_ok=True)
    
    # Scan and process series data
    series_data = scan_featured_series()
    
    if series_data:
        print(f"\n📊 Found {len(series_data)} series items")
        
        # Update JSON file
        if update_json_file(series_data):
            print("\n🎉 Successfully updated featured series!")
            print("🔄 Refresh your website to see the changes")
        else:
            print("\n❌ Failed to update JSON file")
    else:
        print("\n⚠️  No series data found")
    
    print("\n" + "=" * 50)
    print("✨ Auto-update complete!")

if __name__ == "__main__":
    main()
