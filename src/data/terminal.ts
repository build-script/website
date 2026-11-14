// Real output of build-script, taken at OUTPUTS_COMMIT of site.ts from a workspace with a Kotlin app, a C++ library and
// a module of the Go plugin, the same project build twice. Only the home directory is written as ~.

export interface TerminalLine {
    /** the module a log line names, like [api] */
    module?: string;
    text: string;
    /** milliseconds before the line shows up in the animation */
    pause: number;
}

export interface TerminalStep {
    command: string;
    lines: TerminalLine[];
}

export interface TerminalSession {
    directory: string;
    steps: TerminalStep[];
}

/** The project of the hero: build new workspace shop, then add kotlin-app api, cpp-library pricing and go gateway */
export const HERO_SESSION: TerminalSession = {
    directory: "~/shop",
    steps: [
        {
            command: "build",
            lines: [
                { module: "gateway", text: "Running go build", pause: 420 },
                { module: "api", text: "JDK ~/.build-script/jdks/temurin-21-macos-aarch64/Contents/Home", pause: 260 },
                { module: "api", text: "Resolving dependencies (Kotlin 2.4.21)", pause: 380 },
                { module: "api", text: "Compiling 1 Kotlin file(s)", pause: 900 },
                { module: "pricing", text: "Compiling 1 C/C++ file(s)", pause: 240 },
                { module: "gateway", text: "Done: ~/shop/gateway/build/commands/gateway/gateway", pause: 760 },
                { module: "pricing", text: "Done: ~/shop/pricing/build/lib/libpricing.a", pause: 320 },
                { module: "api", text: "Done: ~/shop/api/build/libs/api.jar", pause: 1300 },
            ],
        },
        {
            command: "build",
            lines: [
                { module: "gateway", text: "Up to date", pause: 260 },
                { module: "api", text: "Up to date", pause: 60 },
                { module: "pricing", text: "Up to date", pause: 60 },
            ],
        },
    ],
};

