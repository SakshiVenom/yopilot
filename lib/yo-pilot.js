'use strict';
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import crypto from "crypto";
import { z } from "zod";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { ChatXAI } from "@langchain/xai";
import { ChatMistralAI } from "@langchain/mistralai";


import ApiClient from "./api-client.js";
import tools from "./tools.js";

let functionDeclarations, functions;

class YoPilot {
    #app;
    #thread_id;
    static setFunctionDeclarations(module){
        functionDeclarations = module;
    }
    static setFunctionDefinitions(module){
        functions = module; 
    }

    constructor({baseUrl=process.env.B1_COCKPIT_API_BASE_URL, entSessionId=null, authToken=process.env.B1_COCKPIT_AUTH_TOKEN}={}) {
        let llm;
        let llmParam = { model: process.env.MODEL, temperature:  +process.env.TEMPERATURE||undefined, maxRetries: +process.env.MAX_RETRIES||undefined};

        if(process.env.GOOGLE_API_KEY){
            llm = new ChatGoogleGenerativeAI( llmParam );
        }else if(process.env.OPENAI_API_KEY){
            llm = new ChatOpenAI( llmParam );
        }else if(process.env.ANTHROPIC_API_KEY){
            llm = new ChatAnthropic( llmParam );
        }else if(process.env.GROQ_API_KEY){
            llm = new ChatGroq( llmParam );
        }else if(process.env.XAI_API_KEY){
            llm = new ChatXAI( llmParam );
        }else if(process.env.MISTRAL_API_KEY){
            llm = new ChatMistralAI( llmParam );
        }else{
            throw Error("Please provide API key for a model");
        }
        let client = new ApiClient(baseUrl, {
            "Authorization": authToken ? `Bearer ${authToken}` : undefined,
            "Cookie": entSessionId ? `${entSessionId}` : undefined
        });
        const oFunctions = new functions(client);
        const oFunctionDeclarations = new functionDeclarations(z);
        const oTools = new tools(oFunctions, oFunctionDeclarations);
        const checkpointSaver = new MemorySaver();
        this.#app = createReactAgent({
            llm,
            tools: oTools,
            checkpointSaver
        });
    }

    async #startChat(){
        this.#thread_id = crypto.randomUUID();
        await this.#app.invoke(
            { messages: [ process.env.GOOGLE_API_KEY ? new HumanMessage(process.env.SYSTEM_PROMPT) : new SystemMessage(process.env.SYSTEM_PROMPT)] },
            { configurable: { thread_id: 42 } }
        );
    }

    async #sendPrompt({prompt}){
        const result = await this.#app.invoke(
            { messages: [new HumanMessage(prompt)] },
            { configurable: { thread_id: 42 } }
        );
        return result.messages.at(-1)?.content;
    }

    async chat(prompt) {
        let responseText;
        try{
            if(!this.#thread_id) await this.#startChat();
            responseText = await this.#sendPrompt({ prompt });
        }catch(err){
            responseText = decodeURIComponent(err.message);
        }
        return Promise.resolve(responseText);
    }
}

export default YoPilot;