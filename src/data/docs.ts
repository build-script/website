// The docs of build-script and of its official plugins. They stay in their repositories, npm run docs fetches them
// into .docs/ and every build renders them as pages below /docs/. The order here is the order of the navigation.

export const DOCS_DIRECTORY = ".docs";

/** What npm run docs writes next to the docs: the commit of every repository it fetched */
export const DOC_SOURCES_FILE = `${DOCS_DIRECTORY}/sources.json`;

export const REPOSITORIES = {
    build: { name: "build-script/build", url: "https://github.com/build-script/build", branch: "main" },
    plugins: { name: "build-script/plugins", url: "https://github.com/build-script/plugins", branch: "main" },
} as const;

export type RepositoryKey = keyof typeof REPOSITORIES;

export type DocSources = Record<RepositoryKey, { commit: string }>;

export type DocGroup = "Start" | "Languages" | "Plugins";

export interface Doc {
    repository: RepositoryKey;
    /** the file in its repository */
    path: string;
    /** the page below /docs/, empty for /docs/ itself */
    slug: string;
    /** the name in the navigation */
    label: string;
    group: DocGroup;
    /** for search engines and link previews, in the words of the table in docs/README.md */
    description: string;
}

export const DOCS: readonly Doc[] = [
    {
        repository: "build",
        path: "README.md",
        slug: "",
        label: "Overview",
        group: "Start",
        description: "One build language and one command line for every language: installation, languages and commands.",
    },
    {
        repository: "build",
        path: "docs/language.md",
        slug: "language",
        label: "The build language",
        group: "Start",
        description: "The build language: values, types, conditions, functions, use.",
    },
    {
        repository: "build",
        path: "docs/commands.md",
        slug: "commands",
        label: "Commands",
        group: "Start",
        description: "Every command: build, run, test, idea, new, add, install, clean, config, plugins.",
    },
    {
        repository: "build",
        path: "docs/java.md",
        slug: "java",
        label: "Java",
        group: "Languages",
        description: "use java: jars, fat jars, dependencies, repositories, tests, resources, JDKs.",
    },
    {
        repository: "build",
        path: "docs/kotlin.md",
        slug: "kotlin",
        label: "Kotlin",
        group: "Languages",
        description: "use kotlin: what Kotlin adds, compiler plugins, KSP.",
    },
    {
        repository: "build",
        path: "docs/android.md",
        slug: "android",
        label: "Android",
        group: "Languages",
        description: "use android: apps and libraries, release builds, the SDK, devices, tests.",
    },
    {
        repository: "build",
        path: "docs/cpp.md",
        slug: "cpp",
        label: "C and C++",
        group: "Languages",
        description: "use c and use cpp: C and C++ modules, vcpkg, CMake, toolchains, tests.",
    },
    {
        repository: "build",
        path: "docs/plugins.md",
        slug: "plugins",
        label: "Using plugins",
        group: "Plugins",
        description: "Plugins: use go, use \"owner/repository\", versions, build_command and tool.",
    },
    {
        repository: "plugins",
        path: "README.md",
        slug: "official-plugins",
        label: "Official plugins",
        group: "Plugins",
        description: "The official plugins of build-script, how plugins work and how a plugin joins the repository.",
    },
    {
        repository: "plugins",
        path: "docs/writing-plugins.md",
        slug: "writing-plugins",
        label: "Writing a plugin",
        group: "Plugins",
        description: "A plugin is a build script: build_command, tool and the build language, step by step, and its limits.",
    },
    {
        repository: "plugins",
        path: "go/README.md",
        slug: "go",
        label: "The Go plugin",
        group: "Plugins",
        description: "Go programs with the toolchain of go.dev: build, run and test, also for other systems.",
    },
];

/** Files that are no page of their own: the table of docs/README.md is the navigation of every page */
export const DOC_ALIASES: Readonly<Record<string, string>> = {
    "build/docs/README.md": "",
};
