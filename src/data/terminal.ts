// Real output of build-script, a Kotlin program built and started. Only the home directory is written as ~.

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

/** A Kotlin program of build new kotlin hello, built, then started */
export const HERO_SESSION: TerminalSession = {
    directory: "~/hello",
    steps: [
        {
            command: "build",
            lines: [
                { module: "hello", text: "JDK ~/.build-script/jdks/temurin-21-macos-aarch64/Contents/Home", pause: 420 },
                { module: "hello", text: "Resolving dependencies (Kotlin 2.4.21)", pause: 380 },
                { module: "hello", text: "Compiling 1 Kotlin file(s)", pause: 900 },
                { module: "hello", text: "Done: ~/hello/./build/libs/hello.jar", pause: 1300 },
            ],
        },
        {
            command: "build run",
            lines: [
                { module: "hello", text: "Up to date", pause: 260 },
                { text: "> Running hello", pause: 120 },
                { text: "Hello from hello", pause: 300 },
            ],
        },
    ],
};
