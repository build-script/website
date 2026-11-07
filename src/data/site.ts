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

/**
 * The two lines of the installation in the README, for macOS on Apple silicon.
 * TODO: build-script has published no release yet, the download only works after the first one
 */
export const INSTALL_COMMAND =
    "curl -L https://github.com/build-script/build/releases/latest/download/build-script-aarch64-apple-darwin.tar.gz | tar xz && mv build-script-aarch64-apple-darwin/build ~/.local/bin/";

/** The README's table of archives, for every other system */
export const INSTALL_OTHER_SYSTEMS = `${REPOSITORY}#installation`;
