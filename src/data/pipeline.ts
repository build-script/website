// What happens between build and a finished module, in the order build-script does it. The highlighted path is
// the Kotlin module of the hero, the others are gray, like the languages.

export interface PipelineNode {
    id: string;
    label: string;
    detail: string;
    highlighted?: boolean;
}

export interface PipelineStage {
    name: string;
    nodes: PipelineNode[];
}

export const STAGES: PipelineStage[] = [
    {
        name: "Manifest",
        nodes: [
            { id: "script", label: "project.build", detail: "modules, their calls", highlighted: true },
            { id: "lock", label: "project.lock", detail: "checksums, commits" },
        ],
    },
    {
        name: "Resolution",
        nodes: [
            { id: "maven", label: "Maven repositories", detail: "POMs, BOMs, variants", highlighted: true },
            { id: "vcpkg", label: "vcpkg ports", detail: "C and C++ libraries" },
            { id: "plugins", label: "plugins", detail: "tags in git" },
            { id: "tools", label: "JDKs and tools", detail: "checked by SHA-256" },
        ],
    },
    {
        name: "Compilation",
        nodes: [
            { id: "kotlinc", label: "kotlinc + javac", detail: "Kotlin and Java", highlighted: true },
            { id: "android", label: "aapt2 + d8", detail: "Android apps" },
            { id: "clang", label: "clang, cc", detail: "C and C++ sources" },
            { id: "go", label: "go build", detail: "a build_command" },
        ],
    },
    {
        name: "Artifacts",
        nodes: [
            { id: "jar", label: "api.jar", detail: "build/libs/", highlighted: true },
            { id: "apk", label: "app-debug.apk", detail: "build/outputs/apk/" },
            { id: "library", label: "libpricing.a", detail: "build/lib/" },
            { id: "program", label: "gateway", detail: "build/commands/" },
        ],
    },
];

export const EDGES: Array<[from: string, to: string]> = [
    ["script", "maven"],
    ["script", "vcpkg"],
    ["script", "plugins"],
    ["script", "tools"],
    ["lock", "maven"],
    ["lock", "plugins"],
    ["lock", "tools"],
    ["maven", "kotlinc"],
    ["maven", "android"],
    ["vcpkg", "clang"],
    ["plugins", "go"],
    ["tools", "kotlinc"],
    ["tools", "go"],
    ["kotlinc", "jar"],
    ["android", "apk"],
    ["clang", "library"],
    ["go", "program"],
];
