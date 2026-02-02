import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const fixPostcssSource = () => {
  return {
    postcssPlugin: "fix-postcss-source",
    Once(root, { result }) {
      const inputFile = root.source?.input?.file || result?.opts?.from;
      if (!inputFile) return;
      root.walkDecls((decl) => {
        if (!decl.source?.input?.file) {
          decl.source = {
            ...decl.source,
            input: {
              ...(decl.source?.input || {}),
              file: inputFile,
            },
          };
        }
      });
    },
  };
};
fixPostcssSource.postcss = true;

export default {
  plugins: [tailwindcss(), autoprefixer(), fixPostcssSource()],
};
