// subset-font brings no types of its own
declare module "subset-font" {
    interface SubsetOptions {
        targetFormat?: "sfnt" | "woff" | "woff2";
        variationAxes?: Record<string, number | { min: number; max: number; default?: number }>;
    }

    export default function subsetFont(font: Buffer, text: string, options?: SubsetOptions): Promise<Buffer>;
}
