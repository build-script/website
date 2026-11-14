// The languages build-script builds today, as the README of build-script lists them

export type LanguageStatus = "available" | "in progress" | "planned";

export interface Language {
    name: string;
    /** a short mark in the display type instead of a logo */
    mark: string;
    use: string;
    /** a part of build-script, or a plugin of the official list */
    source: "built in" | "plugin";
    builds: string;
    status: LanguageStatus;
    docs: string;
}

const DOCS = "https://github.com/build-script/build/blob/main/docs";

// TODO: no language is in progress or planned in the repository yet, add them here once there is a roadmap
export const LANGUAGES: Language[] = [
    {
        name: "Kotlin",
        mark: "KT",
        use: "use kotlin",
        source: "built in",
        builds: "jars, fat jars, KSP, compiler plugins",
        status: "available",
        docs: `${DOCS}/kotlin.md`,
    },
    {
        name: "Java",
        mark: "JV",
        use: "use java",
        source: "built in",
        builds: "jars, annotation processors, JUnit",
        status: "available",
        docs: `${DOCS}/java.md`,
    },
    {
        name: "Android",
        mark: "AD",
        use: "use android",
        source: "built in",
        builds: "apks, app bundles, R8, instrumented tests",
        status: "available",
        docs: `${DOCS}/android.md`,
    },
    {
        name: "C++",
        mark: "C++",
        use: "use cpp",
        source: "built in",
        builds: "programs, libraries, vcpkg, CMake, JNI",
        status: "available",
        docs: `${DOCS}/cpp.md`,
    },
    {
        name: "C",
        mark: "C",
        use: "use c",
        source: "built in",
        builds: "programs, static and shared libraries",
        status: "available",
        docs: `${DOCS}/cpp.md`,
    },
    {
        name: "Go",
        mark: "GO",
        use: "use go",
        source: "plugin",
        builds: "programs, also for other systems",
        status: "available",
        docs: "https://github.com/build-script/plugins/tree/main/go",
    },
    {
        name: "Yours",
        mark: "+",
        use: 'use "owner/repo"',
        source: "plugin",
        builds: "any compiler, driven by a build script",
        status: "available",
        docs: "https://github.com/build-script/plugins/blob/main/docs/writing-plugins.md",
    },
];
