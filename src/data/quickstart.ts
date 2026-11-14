// The first steps with build-script, with the output it really prints, taken at OUTPUTS_COMMIT of site.ts

export interface QuickstartStep {
    title: string;
    command: string;
    output: Array<{ module?: string; text: string }>;
}

export const QUICKSTART: QuickstartStep[] = [
    {
        title: "Create a project",
        command: "build new kotlin hello",
        output: [{ text: "Created kotlin project hello in hello with the package com.example.hello" }],
    },
    {
        title: "Build it",
        command: "cd hello && build",
        output: [
            { module: "hello", text: "JDK ~/.build-script/jdks/temurin-21-macos-aarch64/Contents/Home" },
            { module: "hello", text: "Resolving dependencies (Kotlin 2.4.21)" },
            { module: "hello", text: "Compiling 1 Kotlin file(s)" },
            { module: "hello", text: "Done: ~/hello/./build/libs/hello.jar" },
        ],
    },
    {
        title: "Run it",
        command: "build run",
        output: [{ module: "hello", text: "Up to date" }, { text: "> Running hello" }, { text: "Hello from hello" }],
    },
];
