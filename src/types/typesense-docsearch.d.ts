declare module "typesense-docsearch.js/dist/umd" {
  const docsearch: {
    default: (options: Record<string, unknown>) => void;
  };

  export default docsearch.default;
}
