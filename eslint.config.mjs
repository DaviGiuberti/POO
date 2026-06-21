import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Configuração do ESLint (flat config) para o projeto.
 *
 * Atende ao RNF3 (linter configurado) e reforça o RNF2 (tipagem estrita, sem
 * `any` à toa) tratando `no-explicit-any` como erro. A checagem de "não usado"
 * ignora identificadores prefixados com `_` (convenção para parâmetros mantidos
 * por contrato, mas intencionalmente não utilizados).
 */
export default tseslint.config(
    {
        ignores: ["dist/**", "coverage/**", "node_modules/**"],
    },
    {
        files: ["**/*.ts"],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        rules: {
            // TypeScript já garante a existência de símbolos; evita falsos positivos.
            "no-undef": "off",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
        },
    }
);
