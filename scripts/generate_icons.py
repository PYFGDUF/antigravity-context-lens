#!/usr/bin/env python3
import os
from pathlib import Path

ICONS_DIR = Path("/Users/pengyufeng/.gemini/config/plugins/context-lens/assets/icons")
ICONS_DIR.mkdir(parents=True, exist_ok=True)

icons = {
    "accuracy.svg": {
        "title": "Physical Accuracy Icon",
        "color_light": "#1A73E8",
        "color_dark": "#8AB4F8",
        "bg_light": "#E8F0FE",
        "bg_dark": "#1E293B",
        "body": """
  <circle cx="12" cy="12" r="9" stroke="var(--c)" stroke-width="2"/>
  <circle cx="12" cy="12" r="5" stroke="var(--c)" stroke-width="2"/>
  <circle cx="12" cy="12" r="1.5" fill="var(--c)"/>
  <line x1="12" y1="1" x2="12" y2="4" stroke="var(--c)" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="20" x2="12" y2="23" stroke="var(--c)" stroke-width="2" stroke-linecap="round"/>
  <line x1="1" y1="12" x2="4" y2="12" stroke="var(--c)" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="12" x2="23" y2="12" stroke="var(--c)" stroke-width="2" stroke-linecap="round"/>
"""
    },
    "features.svg": {
        "title": "Key Features Sparkles Icon",
        "color_light": "#7C3AED",
        "color_dark": "#C4B5FD",
        "bg_light": "#F3E8FF",
        "bg_dark": "#2E1065",
        "body": """
  <path d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z" fill="none" stroke="var(--c)" stroke-width="2" stroke-linejoin="round"/>
  <path d="M19 17L20 19.5L22.5 20.5L20 21.5L19 24L18 21.5L15.5 20.5L18 19.5L19 17Z" fill="var(--c)"/>
  <path d="M5 4L5.8 6L8 6.8L5.8 7.5L5 9.5L4.2 7.5L2 6.8L4.2 6L5 4Z" fill="var(--c)"/>
"""
    },
    "install.svg": {
        "title": "Installation Package Icon",
        "color_light": "#059669",
        "color_dark": "#6EE7B7",
        "bg_light": "#ECFDF5",
        "bg_dark": "#064E3B",
        "body": """
  <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="var(--c)" stroke-width="2" stroke-linejoin="round"/>
  <path d="M3 17L12 22L21 17" stroke="var(--c)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M3 12L12 17L21 12" stroke="var(--c)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
"""
    },
    "guide.svg": {
        "title": "Usage Guide Icon",
        "color_light": "#2563EB",
        "color_dark": "#93C5FD",
        "bg_light": "#EFF6FF",
        "bg_dark": "#1E3A8A",
        "body": """
  <circle cx="12" cy="12" r="9.5" stroke="var(--c)" stroke-width="2"/>
  <polygon points="12,6 15,11 9,11" fill="var(--c)"/>
  <polygon points="12,18 9,13 15,13" fill="var(--c)" opacity="0.4"/>
  <circle cx="12" cy="12" r="1.5" fill="var(--c)"/>
"""
    },
    "architecture.svg": {
        "title": "Architecture Blueprint Icon",
        "color_light": "#4F46E5",
        "color_dark": "#A5B4FC",
        "bg_light": "#EEF2FF",
        "bg_dark": "#312E81",
        "body": """
  <rect x="3" y="3" width="7" height="6" rx="1.5" stroke="var(--c)" stroke-width="2"/>
  <rect x="14" y="3" width="7" height="6" rx="1.5" stroke="var(--c)" stroke-width="2"/>
  <rect x="8.5" y="15" width="7" height="6" rx="1.5" stroke="var(--c)" stroke-width="2"/>
  <path d="M6.5 9V12H17.5V9" stroke="var(--c)" stroke-width="2" stroke-linejoin="round"/>
  <line x1="12" y1="12" x2="12" y2="15" stroke="var(--c)" stroke-width="2"/>
"""
    },
    "folder.svg": {
        "title": "Directory Structure Folder Icon",
        "color_light": "#D97706",
        "color_dark": "#FCD34D",
        "bg_light": "#FFFBEB",
        "bg_dark": "#78350F",
        "body": """
  <path d="M3 6C3 4.89543 3.89543 4 5 4H9.58579C10.1162 4 10.6249 4.21071 11 4.58579L12.4142 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" stroke="var(--c)" stroke-width="2" stroke-linejoin="round"/>
"""
    },
    "license.svg": {
        "title": "License Certificate Icon",
        "color_light": "#4B5563",
        "color_dark": "#9CA3AF",
        "bg_light": "#F3F4F6",
        "bg_dark": "#1F2937",
        "body": """
  <path d="M9 12H15M9 16H13M6 3H14L18 7V20C18 20.5523 17.5523 21 17 21H6C5.44772 21 5 20.5523 5 20V4C5 3.44772 5.44772 3 6 3Z" stroke="var(--c)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 3V7H18" stroke="var(--c)" stroke-width="2" stroke-linejoin="round"/>
"""
    },
    "theme.svg": {
        "title": "Theme Design Palette Icon",
        "color_light": "#EA4335",
        "color_dark": "#F28B82",
        "bg_light": "#FCE8E6",
        "bg_dark": "#5C1D1D",
        "body": """
  <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C12.83 21 13.5 20.33 13.5 19.5C13.5 19.11 13.35 18.76 13.11 18.49C12.88 18.23 12.73 17.88 12.73 17.5C12.73 16.67 13.4 16 14.23 16H16C18.76 16 21 13.76 21 11C21 6.58 16.97 3 12 3Z" stroke="var(--c)" stroke-width="2"/>
  <circle cx="7.5" cy="10.5" r="1.5" fill="var(--c)"/>
  <circle cx="10.5" cy="7.5" r="1.5" fill="var(--c)"/>
  <circle cx="14.5" cy="7.5" r="1.5" fill="var(--c)"/>
  <circle cx="17.5" cy="11.5" r="1.5" fill="var(--c)"/>
"""
    },
    "gauge.svg": {
        "title": "Dashboard Meter Gauge Icon",
        "color_light": "#1A73E8",
        "color_dark": "#8AB4F8",
        "bg_light": "#E8F0FE",
        "bg_dark": "#1E293B",
        "body": """
  <path d="M4.5 16.5C3.5 14.5 3 12.3 3 10C3 5 7 1 12 1C17 1 21 5 21 10C21 12.3 20.5 14.5 19.5 16.5" stroke="var(--c)" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="12" x2="16" y2="8" stroke="var(--c)" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="2.5" fill="var(--c)"/>
"""
    },
    "bolt.svg": {
        "title": "Prompt Cache Lightning Bolt Icon",
        "color_light": "#10B981",
        "color_dark": "#34D399",
        "bg_light": "#ECFDF5",
        "bg_dark": "#064E3B",
        "body": """
  <polygon points="13 2 4 14 11 14 9 22 20 10 13 10 15 2" stroke="var(--c)" stroke-width="2" stroke-linejoin="round" fill="none"/>
"""
    },
    "chart.svg": {
        "title": "Growth Trend Analytics Chart Icon",
        "color_light": "#3B82F6",
        "color_dark": "#60A5FA",
        "bg_light": "#EFF6FF",
        "bg_dark": "#1E3A8A",
        "body": """
  <polyline points="3 17 9 11 14 15 21 7" fill="none" stroke="var(--c)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="15 7 21 7 21 13" fill="none" stroke="var(--c)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="3" y1="21" x2="21" y2="21" stroke="var(--c)" stroke-width="2" stroke-linecap="round"/>
"""
    },
    "tools.svg": {
        "title": "Tools and Throughput Icon",
        "color_light": "#8B5CF6",
        "color_dark": "#C084FC",
        "bg_light": "#F5F3FF",
        "bg_dark": "#4C1D95",
        "body": """
  <circle cx="12" cy="12" r="3" stroke="var(--c)" stroke-width="2"/>
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="var(--c)" stroke-width="2"/>
"""
    },
    "optimize.svg": {
        "title": "One-click Optimization Wand Icon",
        "color_light": "#EC4899",
        "color_dark": "#F472B6",
        "bg_light": "#FDF2F8",
        "bg_dark": "#831843",
        "body": """
  <line x1="4" y1="20" x2="16" y2="8" stroke="var(--c)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M15 4L16 6.5L18.5 7.5L16 8.5L15 11L14 8.5L11.5 7.5L14 6.5L15 4Z" fill="var(--c)"/>
  <circle cx="6" cy="6" r="1.5" fill="var(--c)"/>
  <circle cx="19" cy="15" r="1" fill="var(--c)"/>
"""
    },
    "i18n.svg": {
        "title": "Internationalization Globe Icon",
        "color_light": "#0284C7",
        "color_dark": "#38BDF8",
        "bg_light": "#F0F9FF",
        "bg_dark": "#075985",
        "body": """
  <circle cx="12" cy="12" r="9" stroke="var(--c)" stroke-width="2"/>
  <line x1="3" y1="12" x2="21" y2="12" stroke="var(--c)" stroke-width="2"/>
  <ellipse cx="12" cy="12" rx="4.5" ry="9" stroke="var(--c)" stroke-width="2"/>
"""
    },
    "vector.svg": {
        "title": "Vector Precision Pen Tool Icon",
        "color_light": "#10B981",
        "color_dark": "#34D399",
        "bg_light": "#ECFDF5",
        "bg_dark": "#064E3B",
        "body": """
  <path d="M12 2L19 9L15 13L11 9L12 2Z" stroke="var(--c)" stroke-width="2" stroke-linejoin="round"/>
  <path d="M11 9L6 14L8 16L13 11" stroke="var(--c)" stroke-width="2" stroke-linecap="round"/>
  <circle cx="5" cy="19" r="2" stroke="var(--c)" stroke-width="2"/>
  <line x1="6.5" y1="17.5" x2="7.5" y2="15.5" stroke="var(--c)" stroke-width="2"/>
"""
    }
}

template = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <title>{title}</title>
  <style>
    :root {{
      --c: {color_light};
    }}
    @media (prefers-color-scheme: dark) {{
      :root {{
        --c: {color_dark};
      }}
    }}
  </style>
  {body}
</svg>
"""

for fname, meta in icons.items():
    svg_content = template.format(
        title=meta["title"],
        color_light=meta["color_light"],
        color_dark=meta["color_dark"],
        body=meta["body"].strip()
    )
    (ICONS_DIR / fname).write_text(svg_content, encoding="utf-8")
    print(f"Generated {fname}")
