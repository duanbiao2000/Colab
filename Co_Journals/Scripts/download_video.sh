#!/bin/bash

# 检查是否提供了URL参数
if [ -z "$1" ]; then
  echo "请提供一个YouTube视频的URL。"
  exit 1
fi

# 下载视频
yt-dlp -f 'bestvideo[height<=1080]+bestaudio/best[height<=1080]' \
  --sub-lang en,zh \
  --write-sub \
  --write-auto-sub \
  --add-metadata \
  -o '/home/duanbiao2000/Videos/%(title)s.mp4' \
  "$1"
