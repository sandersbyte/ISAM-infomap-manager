# IBM-isam-infomap README

The IBM-isam-infomap extension can be installed on Visual studio code and is used to manage infomap scripts to increase development speed. 

## Features

Features include:
- Uploading mapping rule content
- Deploy changes
- Reload federation/aac runtime
- Clear trace log file
- download trace log file


## Requirements

Visual studio code 1.4.1

## Extension Usage

Commands are triggered using Windows + SHIFT + p

First, the ISAM Primary master hostname and credentials must be set to the extension.

- ISAM register host:
Register hostname and credentials in the extension for the amount of tim Visual Studio Code is running
- ISAM Register mapping rule:
Register existing mapping rule to be used in later commands
- ISAM Deploy changes:
Deploy changes
- ISAM upload mapping rule:
upload the current focussed text editor content to the registered mapping rule
- ISAM Reload federation runtime:
Reload the federation runtime
- ISAM Clear trace file:
Clear the trace.log file
- ISAM Download trace file:
Opens a new temporary document and downloads the current trace file
- ISAM upload, deploy reload:
upload mapping rule, deploy and reload in one command
