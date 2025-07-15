# Website Blocker Chrome Extension

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description
This is a Chrome extension that allows users to block specific websites. It helps users increase productivity by preventing access to distracting websites.

## Installation
1. Clone the repository: `git clone https://github.com/your-username/Website-Blocker-Chrome-Extension.git`
2. Open Chrome and go to `chrome://extensions`
3. Enable Developer mode
4. Click on "Load unpacked" and select the cloned repository folder

## Usage
1. Click on the extension icon in the Chrome toolbar
2. Add websites to block

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Tutorial
To learn how to build this project, check out the tutorial on [YouTube](https://youtu.be/wZcU07zfMSk).

<br/>

# Fork Updates:
- **Issue with already opened websites:**

I encountered an issue where if a blocked website is already open, the extension does not block further navigation within the already opened website. Only when you refresh the page would the blocking start to take effect.

Using the code from here [https://stackoverflow.com/a/67729185](https://stackoverflow.com/a/67729185) I made it such that a change in the url would also trigger the block check, thus addressing this 'issue'.

This however did neccesitate a couple of changes in the code and thus the code here might be significantly different from the original repo.

## Todo:
- [x] Added editing functionality
- [x] Added day-of-the-week based blocking
- [x] Added time based blocking
- [ ] Discourage deleting blocked websites
- [ ] Allow regex based blocking
