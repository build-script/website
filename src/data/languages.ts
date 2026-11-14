// The languages build-script builds today, as the README of build-script lists them
import { docHref } from "../lib/docs";
import { HOME } from "../lib/paths";

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
    /** the page of its doc on this site */
    docs: string;
}


// TODO: no language is in progress or planned in the repository yet, add them here once there is a roadmap
export const LANGUAGES: Language[] = [
    {
        name: "Kotlin",
        mark: "KT",
        use: "use kotlin",
        source: "built in",
        builds: "jars, fat jars, KSP, compiler plugins",
        status: "available",
        docs: docHref("kotlin", HOME),
    },
    {
        name: "Java",
        mark: "JV",
        use: "use java",
        source: "built in",
        builds: "jars, annotation processors, JUnit",
        status: "available",
        docs: docHref("java", HOME),
    },
    {
        name: "Android",
        mark: "AD",
        use: "use android",
        source: "built in",
        builds: "apks, app bundles, R8, instrumented tests",
        status: "available",
        docs: docHref("android", HOME),
    },
    {
        name: "C++",
        mark: "C++",
        use: "use cpp",
        source: "built in",
        builds: "programs, libraries, vcpkg, CMake, JNI",
        status: "available",
        docs: docHref("cpp", HOME),
    },
    {
        name: "C",
        mark: "C",
        use: "use c",
        source: "built in",
        builds: "programs, static and shared libraries",
        status: "available",
        docs: docHref("cpp", HOME),
    },
    {
        name: "Go",
        mark: "GO",
        use: "use go",
        source: "plugin",
        builds: "programs, also for other systems",
        status: "available",
        docs: docHref("go", HOME),
    },
    {
        name: "Yours",
        mark: "+",
        use: 'use "owner/repo"',
        source: "plugin",
        builds: "any compiler, driven by a build script",
        status: "available",
        docs: docHref("writing-plugins", HOME),
    },
];
