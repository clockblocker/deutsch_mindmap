#!/bin/bash

# Loop through all letters of the alphabet
for letter in {A..Z}; do
  # Ensure the destination folder exists
  mkdir -p "./$letter"
  
  # Move files starting with the current letter (case-insensitive)
  shopt -s nocaseglob
  mv -v "$letter"* ./"$letter"/ 2>/dev/null
  shopt -u nocaseglob
done

echo "Files moved to corresponding folders based on their starting letter!"