/** @format */

const fs = require("fs");
const path = require("path");
function getRandomName(files) {
  return files[Math.floor(Math.random() * files.length)];
}

function loadTechnology() {
  let basePath = "node_modules/devicon/icons";
  let result = [];
  let dir = fs.readdirSync(basePath);
  for (let folder of dir) {
    let subDir = fs.readdirSync(path.join(basePath, folder));
    subdir.filter(
      (value) => value.substring(value.lastIndexOf(".")) === ".svg"
    );
    let file = getRandomName(subDir);
    let link = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${folder}/${file}`;
    result.push({
      name: folder,
      link,
    });
  }
  return JSON.stringify(result,null,2);
}
let json = loadTechnology();
fs.writeFile('technology.json',json,'utf-8',(err)=>{
    if (err){
        console.log(err);
    }
});