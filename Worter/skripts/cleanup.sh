#!/usr/bin/env bash

# Enable nullglob so that if there are no matches, the for loop doesn't iterate
shopt -s nullglob

# Function to translate the first letter into uppercase (German-aware)
function to_upper_german() {
  case "$1" in
    [a-z])        # regular ASCII a-z
      tr '[:lower:]' '[:upper:]' <<< "$1"
      ;;
    [A-Z])        # already uppercase
      echo "$1"
      ;;
    ä) echo "Ä";;
    ö) echo "Ö";;
    ü) echo "Ü";;
    ß) echo "SS";;  # If you prefer uppercase ß, use "ẞ" here instead.
    *)  # Non-German or unexpected character → just return as-is
      echo "$1"
      ;;
  esac
}

for file in *; do
  # Skip directories, only act on files
  if [[ -d "$file" ]]; then
    continue
  fi

  # Extract the first character of the filename
  first_char="${file:0:1}"

  # Check if this first character is in the set of German letters
  # (lowercase or uppercase: Ä, Ö, Ü, ä, ö, ü, ß)
  if [[ "$first_char" =~ ^[ÄÖÜäöüß]$ ]]; then
    # Convert to uppercase (German-aware)
    uppercase_first_char="$(to_upper_german "$first_char")"
    
    # Create the destination directory if it doesn't exist
    mkdir -p "$uppercase_first_char"
    
    # Move the file there
    mv -v -- "$file" "$uppercase_first_char/"
  fi
done