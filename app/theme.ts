import { createTheme, type MantineColorsTuple } from "@mantine/core";

const brand: MantineColorsTuple = [
  "#ffe9ef",
  "#ffd1dc",
  "#faa2b8",
  "#f57192",
  "#f14873",
  "#ef2f60",
  "#ef2156",
  "#d51446",
  "#bf0b3d",
  "#a80033",
];

const kirai: MantineColorsTuple = [
  "#e7f2ff",
  "#cee0ff",
  "#9bbeff",
  "#649aff",
  "#397cfe",
  "#1f69fe",
  "#0d5fff",
  "#004fe4",
  "#0046cd",
  "#003cb6",
];

export const theme = createTheme({
  primaryColor: "brand",
  primaryShade: { light: 6, dark: 5 },
  colors: { brand, kirai },
  fontFamily:
    '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Noto Sans JP", "Segoe UI", system-ui, sans-serif',
  headings: {
    fontWeight: "700",
  },
  defaultRadius: "md",
});
