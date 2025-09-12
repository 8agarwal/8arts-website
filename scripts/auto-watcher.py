#!/usr/bin/env python3
"""
Auto-Watcher Script for Project Gallery
Watches the project gallery folder for changes and automatically updates the JSON
"""

import os
import time
import subprocess
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Configuration
PROJECT_GALLERY_FOLDER = "/Users/parthgupta/Desktop/code_somya/project gallery photo"
UPDATE_SCRIPT = "/Users/parthgupta/Desktop/code_somya/8arts_website/scripts/auto-update-projects.py"

class ProjectGalleryHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_update = 0
        self.update_delay = 2  # Wait 2 seconds before updating to avoid multiple rapid updates

    def on_modified(self, event):
        if not event.is_directory:
            self.schedule_update()

    def on_created(self, event):
        if not event.is_directory:
            self.schedule_update()

    def on_deleted(self, event):
        if not event.is_directory:
            self.schedule_update()

    def schedule_update(self):
        current_time = time.time()
        if current_time - self.last_update > self.update_delay:
            self.last_update = current_time
            print(f"\n🔄 File change detected! Updating project gallery...")
            try:
                subprocess.run(['python3', UPDATE_SCRIPT], check=True)
                print("✅ Project gallery updated successfully!")
            except subprocess.CalledProcessError as e:
                print(f"❌ Error updating project gallery: {e}")

def start_watcher():
    print("🚀 Starting Project Gallery Auto-Watcher")
    print(f"📂 Watching folder: {PROJECT_GALLERY_FOLDER}")
    print("🔄 Will automatically update when you add/change photos or text files")
    print("Press Ctrl+C to stop")
    print("=" * 60)

    # Check if the folder exists
    if not os.path.exists(PROJECT_GALLERY_FOLDER):
        print(f"❌ Project gallery folder not found: {PROJECT_GALLERY_FOLDER}")
        return

    # Set up the file system event handler
    event_handler = ProjectGalleryHandler()
    observer = Observer()
    observer.schedule(event_handler, PROJECT_GALLERY_FOLDER, recursive=True)

    # Start watching
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping auto-watcher...")
        observer.stop()
    observer.join()
    print("✅ Auto-watcher stopped")

if __name__ == "__main__":
    start_watcher()
