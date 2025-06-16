'use strict';

import functionDeclarations from "../../yo-pilot.utils/function-declarations.js";
import functionDefinitions from "../../yo-pilot.utils/function-definitions.js";

import YoPilot from "./lib/yo-pilot.js"

YoPilot.setFunctionDeclarations(functionDeclarations);
YoPilot.setFunctionDefinitions(functionDefinitions);

export default YoPilot;