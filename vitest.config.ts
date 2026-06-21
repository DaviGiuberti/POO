import { defineConfig } from "vitest/config";
import * as fs from "fs";
import * as path from "path";

/**
 * O projeto usa `module: node16`, então os imports trazem a extensão `.js`
 * (ex.: `./conta.js`) apontando para arquivos `.ts`. Este plugin reescreve, na
 * resolução, especificadores relativos terminados em `.js` para o `.ts`
 * correspondente quando ele existe — assim o Vitest consegue carregar o código-fonte.
 */
const resolverTsViaJs = {
    name: "resolver-ts-via-js",
    enforce: "pre" as const,
    resolveId(source: string, importer?: string) {
        if (importer && source.endsWith(".js") && (source.startsWith("./") || source.startsWith("../"))) {
            const candidatoTs = path.resolve(path.dirname(importer), source.replace(/\.js$/, ".ts"));
            if (fs.existsSync(candidatoTs)) {
                return candidatoTs;
            }
        }
        return null;
    },
};

export default defineConfig({
    plugins: [resolverTsViaJs],
    test: {
        environment: "node",
        include: ["tests/**/*.test.ts"],
        coverage: {
            provider: "v8",
            reportsDirectory: "coverage",
            reporter: ["text", "html"],
            // Foco da cobertura: o núcleo de regras de negócio (RNF1).
            include: ["src/models/**", "src/services/**", "src/casos-de-uso/**"],
            // Arquivos sem lógica testável (apenas dados/contratos).
            exclude: ["src/models/dtos.ts"],
        },
    },
});
