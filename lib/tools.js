import { tool } from "@langchain/core/tools";

const tools = function (oFunctions, oFunctionDeclarations){
    return Object.keys(oFunctionDeclarations).reduce((aTools, name)=> {
        if(oFunctions[name])
            aTools.push(tool(oFunctions[name], oFunctionDeclarations[name])); 
        return aTools;
    }, []);
};

export default tools;