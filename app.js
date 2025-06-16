import YoPilot from "./index.js";
import readlineSync from "readline-sync";

let yoPilot = new YoPilot();
while (true) {
    const userPrompt = readlineSync.question('>> ');
    if(userPrompt==='exit'){
        break;
    }
    const responseText = await yoPilot.chat(userPrompt);
    console.log(responseText);
}