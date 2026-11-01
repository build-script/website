// What the page says about build-script itself: its version, its commit and where things are

export const REPOSITORY = "https://github.com/build-script/build";

/** The release the page describes, from Cargo.toml of build-script */
export const VERSION = "0.1.0";

export const LINKS = {
    docs: `${REPOSITORY}/tree/main/docs`,
    github: REPOSITORY,
    // TODO: build-script has no changelog and no release yet, the history of main stands in for one
    changelog: `${REPOSITORY}/commits/main`,
} as const;

