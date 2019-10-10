const fs=require("fs");
const cheerio=require("cheerio");
const url=require("url");

function extractGetParams(str) {
  let re=/\?([^=]+)=([^&]*)(?:&([^=]+)=([^&]*))*/;
  let m=re.exec(str);

  if(!m) {
    console.log("no match!");
    return null;
  }

  if(m.length % 2 !== 1) {
    //console.log("odd");
    return null;
  }

  let dict=new Map();
  for(let i=1;i<m.length;i+=2) {
    const key=m[i];
    const val=m[i+1];
    dict.set(key,val);
  }

  return dict;
}

if(process.argv.length !== 3) {
	console.log("Usage: node watchlater.js YOURFILE");
	return;
}

const fileName=process.argv[2];

fs.readFile(fileName,"utf-8",(err,res)=>{
  if(err) {
    console.log("Error in readFile");
    return;
  }

  const $=cheerio.load(res);
  const entries = $("ytd-playlist-video-renderer");
  console.log(entries.length);

  let json=[];
  for(let i=0;i<entries.length;i++)
  {
    const content=$(entries[i]).find("#content");
    let thumbnail=$(content).find("#img").attr("src");
    const links=$(content).find("a");
    const video=$(links[0]).attr("href");
    const title=$(content).find("#meta #video-title").text().trim();
	const channel=$(content).find("#text").text().trim();

    if(typeof thumbnail === "undefined") {
      console.log(title+" https://youtube.com"+video);
      continue;
    }
    const urlObj=url.parse(thumbnail);
    if( (title === "[Privates Video]" || title === "[Gelöschtes Video]") &&
        (urlObj.protocol === null && urlObj.pathname.search("no_thumbnail") !== -1)) {
        continue;
    }

    let dict=extractGetParams(video);
    if(!dict) {
      console.log(title);
      console.log("dict is null");
      continue;
    }
    if(dict.has("v") === false) {
      console.log("no video id");
      continue;
    }
	
    let obj={
      title:title,
      description:"",
      img:thumbnail,
      id:dict.get("v"),
      link:"https://youtube.com/watch?v="+dict.get("v"),
	  channel:channel
    };

    json.push(obj);
  }

  let str=JSON.stringify(json);
  fs.writeFile(fileName+"_playlist.json",str,err=>{
    if(err) {
      console.log("Write file failed");
      return;
    }
    console.log("Finished!");
  });
});
