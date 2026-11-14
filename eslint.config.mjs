import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "referensi/**",
      "backups/**",
      "**/*.bak",
      "**/*.bak*",
      "app/test-*/**",
      "components/experiments/**",
      "components/sections/*backup*.tsx",
      "components/sections/HeroCinematicV3.tsx",
      "components/sections/HeroCinematicV4.tsx",
      "components/sections/HeroCinematicV5.tsx",
      "components/sections/HeroCinematicV6.tsx",
      "components/sections/HeroCinematicV7.tsx",
      "components/sections/HeroGallery.tsx",
      "components/sections/HorizontalAlumni.tsx",
      "components/sections/HorizontalProgram.tsx",
    ],
  },
  ...nextVitals,
  ...nextTs,
]);

export default eslintConfig;
