import { getArgs } from "./utils.js";
import startBackendServer from "./server-backend.js";

const SERVER_MODES = {
    PRODUCTION: 1,
    DEVELOPMENT: 2,
};

const args = getArgs();

if (typeof args.mode === "undefined") {
    // default to production mode
    args.mode = "production";
}

if (args.mode !== "production" && args.mode !== "development") {
    throw new Error("--mode can only be 'development' or 'production'");
}

const server_mode = args.mode === "production" ? SERVER_MODES.PRODUCTION : SERVER_MODES.DEVELOPMENT;

if (server_mode === SERVER_MODES.DEVELOPMENT) {
    let startFrontendDevServer = (await import("./server-frontend-dev.js")).startFrontendDevServer;
    console.info("Starting server at https://cloud13.de/testwhiteboard/");
    startFrontendDevServer(8080, function () {
        // this time, it's the frontend server that is on port 8080
        // requests for the backend will be proxied to prevent cross origins errors
        startBackendServer(3000);
    });
} else {
    console.info("Starting server at https://cloud13.de/testwhiteboard/");
    startBackendServer(process.env.PORT || 8080);
}
