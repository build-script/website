// What the page says about build-script itself: its version, its commit and where things are. The docs are pages
// of this site, see src/data/docs.ts, everything else is on GitHub.
import { docHref } from "../lib/docs";
import { HOME } from "../lib/paths";

export const REPOSITORY = "https://github.com/build-script/build";

/** The release the page describes, from Cargo.toml of build-script */
export const VERSION = "0.1.0";

/** The commit of build-script the outputs on the page were taken from */
export const COMMIT = "e717afb";

export const LINKS = {
    docs: docHref("", HOME),
    github: REPOSITORY,
    // TODO: build-script has no changelog and no release yet, the history of main stands in for one
    changelog: `${REPOSITORY}/commits/main`,
    plugins: docHref("official-plugins", HOME),
    writingPlugins: docHref("writing-plugins", HOME),
    goPlugin: docHref("go", HOME),
    /** the build script of the Go plugin itself */
    goPluginScript: "https://github.com/build-script/plugins/blob/main/go/plugin.build",
    language: docHref("language", HOME),
    commands: docHref("commands", HOME),
    license: `${REPOSITORY}/blob/main/LICENSE`,
} as const;

/**
 * The two lines of the installation in the README, for macOS on Apple silicon.
 * TODO: build-script has published no release yet, the download only works after the first one
 */
export const INSTALL_COMMAND =
    "curl -L https://github.com/build-script/build/releases/latest/download/build-script-aarch64-apple-darwin.tar.gz | tar xz && mv build-script-aarch64-apple-darwin/build ~/.local/bin/";

/** The README's table of archives, for every other system */
export const INSTALL_OTHER_SYSTEMS = `${docHref("", HOME)}#installation`;
