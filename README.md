# watchlater_playlist_parser


This parser, written for node.js, lets you extract all your videos from your watch later playlist on youtube. Since the watch later playlist is inaccessible using the official youtubeAPI, it must be done manually by scraping the html markup code. The scrape data is stored in a json file in the following format:

[ { title:"Im a video", description:"this video is about...", img:"https://imageforthevideo.jpg", link:"https://linktothevideo" }, ... ]


Usage: 

- Visit your youtube channel and navigate to the watch later playlist
- Keep scrolling down until every video in the playlist has been loaded
- Right click and view the source code of the website
- Copy the html markup code between <div id="content" ...><ytd-playlist-video-renderer>....</div> (including the div) and save to a file
- Run the script node watchlater.js YOURFILE.txt
- A json file containing all the videos will be generated

