function FileParser(filePath) {

// import\s*{(.*)}\s*from\s*"(.*)"

    let fs = require('fs');

    let contents = fs.readFileSync(filePath).toString();

    let lines = contents.split('\n');

    let dependencies = [];

    for(let i = 0; i < lines.length;i++){

        let words = lines[i].split(' ');

        let openCurls = false;
        for (let j = 0; j < words.length; ++j) {

                
        }

        if (words[0] === 'import') {

            console.log(words);
            // dependencies.push(words[1])
        }
    }

    return dependencies;
}


module.exports = FileParser;
