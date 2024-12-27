#!/bin/bash

# Loop through all uppercase and lowercase letters
for letter in {A..Z} {a..z}; do
  # Create the folder if it doesn't already exist
  mkdir -p "$letter"
done

echo "Folders for all letters (A-Z and a-z) have been created!"