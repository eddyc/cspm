
let incdir = process.env.INCDIR;

if (typeof incdir === 'undefined') {

        console.log("CSPM installed but INCDIR is undefined, nowhere specified to install packages\nIn your .bashrc or .zshrc please add for example:\nexport INCDIR=/Users/me/csound-packages\n\n");
}
else {

    console.log("Packages will be installed to: " + incdir + "\nHave a nice day...\n\n");
}
