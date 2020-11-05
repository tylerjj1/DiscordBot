const fs = require('fs'); 

function getFilesRecursive(path, ignoreDir){
    let files = [];
    let dir = fs.readdirSync(path, {withFileTypes: true});
    dir.forEach(file => {
        if(file.isDirectory()){
            if(ignoreDir && ignoreDir.includes(file.name))
                return;
            files = files.concat(getFilesRecursive(`${path}/${file.name}`));    
            return;
        }
        files.push(`${path}/${file.name}`);
    });
    return files;
}

function formatTime(ms){
    let {d, h, m, s} = convertMiliseconds(ms);
    let timeStr = '';

    if(d){
        timeStr += `${d}days `;
        if(h)
            timeStr += `${h}h `;
        if(m)
            timeStr += `${m}m `;
        if(s)
            timeStr += `${s}s`
    }else{
        if(h)
            if(m || s)
                timeStr += `${h}:`;
            else
                timeStr += `${h}hours`;

        m = m.toString().length == 1 ? `0${m}` : m;
        s = s.toString().length == 1 ? `0${s}` : s;

        if(m || s)
            timeStr += `${m}:${s}`;
    }
    return timeStr;
}

function convertMiliseconds(miliseconds, format) {
    let days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;
    
    total_seconds = parseInt(Math.floor(miliseconds / 1000));
    total_minutes = parseInt(Math.floor(total_seconds / 60));
    total_hours = parseInt(Math.floor(total_minutes / 60));
    days = parseInt(Math.floor(total_hours / 24));
  
    seconds = parseInt(total_seconds % 60);
    minutes = parseInt(total_minutes % 60);
    hours = parseInt(total_hours % 24);
    
    switch(format) {
      case 's':
          return total_seconds;
      case 'm':
          return total_minutes;
      case 'h':
          return total_hours;
      case 'd':
          return days;
      default:
          return { d: days, h:  hours, m: minutes, s: seconds };
    }
}

module.exports = {
    getFilesRecursive,
    formatTime,
    convertMiliseconds
}