# 🎨 How to Add New Featured Series

## 📁 Your Folder Structure
```
Desktop/code_somya/featured series/
├── s1/
│   ├── p1/
│   │   ├── photo.jpg (or .heic, .png, etc.)
│   │   └── story.txt (optional)
│   ├── p2/
│   │   ├── photo.jpg
│   │   └── story.txt
│   └── p3/
│       ├── photo.jpg
│       └── story.txt
├── s2/
│   └── ...
└── s3/
    └── ...
```

## 🚀 How to Add New Content

### Step 1: Add Your Photos
1. **Create a new series folder**: `s2`, `s3`, etc.
2. **Create photo folders**: `p1`, `p2`, `p3`, etc.
3. **Add your photos**: Any format (.jpg, .png, .heic, etc.)
4. **Add story files** (optional): Create `story.txt` with your description

### Step 2: Update Your Website
Run this command in your terminal:
```bash
./update-series.sh
```

Or manually:
```bash
python3 scripts/auto-update-series.py
```

### Step 3: Refresh Your Website
Visit: http://127.0.0.1:8014/

## ✨ Features

- **Automatic HEIC conversion** to JPG
- **Auto-copy images** to website assets
- **Auto-generate JSON** for website
- **Supports any image format**
- **Optional story files**

## 📝 Example Story File
Create a `story.txt` file in any photo folder:
```
This piece captures the moment of complete transformation, 
where light meets shadow in perfect harmony. The bold strokes 
represent the intensity of change.
```

## 🔄 Auto-Refresh
Your website automatically refreshes every 5 minutes, so changes appear without manual refresh!

## 🎯 Quick Commands
- **Update series**: `./update-series.sh`
- **Start server**: `python3 -m http.server 8014`
- **View website**: http://127.0.0.1:8014/
