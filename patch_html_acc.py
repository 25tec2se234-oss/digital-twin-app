import os
import re

genesis_file = r"c:\Users\Kumar Kartikey\.vscode DTwin\public\genesis\index.html"
genesis_mirror = r"c:\Users\Kumar Kartikey\.vscode DTwin\public\genesis.html"

with open(genesis_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Buttons & Accessibility attributes in HTML
content = content.replace(
    '<button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle dark and light theme">',
    '<button id="theme-toggle" type="button" class="theme-toggle-btn" aria-label="Switch to light theme">'
)

content = content.replace(
    '<button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="Toggle mobile menu">',
    '<button id="mobile-menu-btn" type="button" class="mobile-menu-btn" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-nav-drawer">'
)

content = content.replace(
    '<button id="btn-begin-genesis" class="btn-primary-glow" aria-controls="genesis-scanner">',
    '<button id="btn-begin-genesis" type="button" class="btn-primary-glow" aria-controls="genesis-scanner">'
)

content = content.replace(
    '<button id="btn-watch-demo" class="btn-secondary-glass">',
    '<button id="btn-watch-demo" type="button" class="btn-secondary-glass" aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-modal">'
)

content = content.replace(
    '<button id="btn-start-scan" class="btn-primary-glow">',
    '<button id="btn-start-scan" type="button" class="btn-primary-glow">'
)

content = content.replace(
    '<button id="btn-open-assessment" class="btn-primary-glow" style="width: 100%; justify-content: center;">',
    '<button id="btn-open-assessment" type="button" class="btn-primary-glow" style="width: 100%; justify-content: center;">'
)

# Option buttons in Quiz
content = content.replace(
    '<button class="option-btn"',
    '<button type="button" class="option-btn" aria-pressed="false"'
)

content = content.replace(
    '<button id="btn-unlock-roadmap" class="btn-primary-glow" style="width: 100%; justify-content: center;">',
    '<button id="btn-unlock-roadmap" type="button" class="btn-primary-glow" style="width: 100%; justify-content: center;">'
)

# Radar SVG chart accessibility
content = content.replace(
    '<svg class="radar-svg" viewBox="0 0 320 230">',
    '<svg class="radar-svg" viewBox="0 0 320 230" role="img" aria-label="5-Axis Cognitive Capability Radar Chart showing Logic, Creativity, Velocity, Domain Focus, and Grit scores">'
)

# Modal close buttons
content = content.replace(
    '<button id="modal-close" class="modal-close-btn" aria-label="Close modal">',
    '<button id="modal-close" type="button" class="modal-close-btn" aria-label="Close modal">'
)

content = content.replace(
    '<button id="roadmap-modal-close" class="modal-close-btn" aria-label="Close modal">',
    '<button id="roadmap-modal-close" type="button" class="modal-close-btn" aria-label="Close modal">'
)

# Video Player attributes
content = content.replace(
    '<div id="yt-video-screen" class="yt-video-screen" title="Click to Play / Pause Video">',
    '<div id="yt-video-screen" class="yt-video-screen" tabindex="0" role="button" aria-label="Walkthrough video screen. Press Space to play or pause" title="Click or Press Space to Play / Pause Video">'
)

content = content.replace(
    '<div id="yt-center-play" class="yt-center-play" aria-label="Play Genesis Walkthrough">',
    '<button id="yt-center-play" type="button" class="yt-center-play" aria-label="Play Genesis Walkthrough">'
)

content = content.replace(
    '<div id="yt-center-play" class="yt-center-play" aria-label="Play Genesis Walkthrough">',
    '<button id="yt-center-play" type="button" class="yt-center-play" aria-label="Play Genesis Walkthrough">'
)

# Replace </div> ending for yt-center-play if button
content = re.sub(
    r'<div id="yt-center-play" class="yt-center-play" aria-label="Play Genesis Walkthrough">(.*?)</div>\s*<div id="yt-step-badge"',
    r'<button id="yt-center-play" type="button" class="yt-center-play" aria-label="Play Genesis Walkthrough">\1</button>\n                    <div id="yt-step-badge"',
    content,
    flags=re.DOTALL
)

content = content.replace(
    '<div id="yt-progress-container" class="yt-progress-container" title="Click to Seek">',
    '<div id="yt-progress-container" class="yt-progress-container" tabindex="0" role="slider" aria-label="Video Seek Scrubber" aria-valuemin="0" aria-valuemax="16" aria-valuenow="0" aria-valuetext="00:00" title="Click or use Left/Right arrows to Seek">'
)

content = content.replace(
    '<button id="yt-play-toggle" class="yt-btn"',
    '<button id="yt-play-toggle" type="button" class="yt-btn"'
)

content = content.replace(
    '<button id="yt-prev-btn" class="yt-btn"',
    '<button id="yt-prev-btn" type="button" class="yt-btn"'
)

content = content.replace(
    '<button id="yt-next-btn" class="yt-btn"',
    '<button id="yt-next-btn" type="button" class="yt-btn"'
)

content = content.replace(
    '<button id="yt-launch-btn" class="btn-primary-glow"',
    '<button id="yt-launch-btn" type="button" class="btn-primary-glow"'
)

# Chapter dots to buttons
content = content.replace(
    '<span class="yt-dot active" id="yt-dot-1" onclick="seekToWalkthroughStep(0)">1</span>',
    '<button type="button" class="yt-dot active" id="yt-dot-1" aria-label="Go to chapter 1" onclick="seekToWalkthroughStep(0)">1</button>'
)
content = content.replace(
    '<span class="yt-dot" id="yt-dot-2" onclick="seekToWalkthroughStep(1)">2</span>',
    '<button type="button" class="yt-dot" id="yt-dot-2" aria-label="Go to chapter 2" onclick="seekToWalkthroughStep(1)">2</button>'
)
content = content.replace(
    '<span class="yt-dot" id="yt-dot-3" onclick="seekToWalkthroughStep(2)">3</span>',
    '<button type="button" class="yt-dot" id="yt-dot-3" aria-label="Go to chapter 3" onclick="seekToWalkthroughStep(2)">3</button>'
)
content = content.replace(
    '<span class="yt-dot" id="yt-dot-4" onclick="seekToWalkthroughStep(3)">4</span>',
    '<button type="button" class="yt-dot" id="yt-dot-4" aria-label="Go to chapter 4" onclick="seekToWalkthroughStep(3)">4</button>'
)

# Save updated HTML back to index.html
with open(genesis_file, 'w', encoding='utf-8') as f:
    f.write(content)

# Mirror to genesis.html
with open(genesis_mirror, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated HTML elements and accessibility attributes successfully.")
