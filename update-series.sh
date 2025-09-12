#!/bin/bash
# Quick update script for featured series

echo "🚀 Updating Featured Series..."
python3 scripts/auto-update-series.py

echo ""
echo "✅ Update complete! Refresh your website at http://127.0.0.1:8014/"
