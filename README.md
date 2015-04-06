# Spitfire-Editor

Code editor built with node/node-webkit, *this editor was built mainly for learning purpose.*

To run clone this repo and execute node-webkit on the editor folder.

## Current features
- Workspaces
- Terminal for managing files and folders
- Code highlight/autocomplete (Provided by Ace Editor)

## Shortcuts on editor
- ESC go back to your last focused panel
- Crtl + W close current tab
- Crtl + Tab next tab
- Crtl + Shift + Tab previous tab

## Shortcuts outside editor
- Crtl + E goes to editor
- Crtl + N goes to navigation tree
- ESC goes to terminal
- Crtl + Shift + O opens filesearch input

## Terminal commands

-  Generic file/folder related commands: cd, rm, mv, touch, open, mkdir
- openfolder PATH, opens a folder to work
- find STRING performs a find in file operation on the current directory and it's chilren

# Knowbugs

- Navigation on the file tree doesn't work very well
