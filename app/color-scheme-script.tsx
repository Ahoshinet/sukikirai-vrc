const LOCAL_STORAGE_KEY = "mantine-color-scheme-value";
const DEFAULT_COLOR_SCHEME = "auto";

const SCRIPT = `try {
  var _colorScheme = window.localStorage.getItem("${LOCAL_STORAGE_KEY}");
  var colorScheme = _colorScheme === "light" || _colorScheme === "dark" || _colorScheme === "auto" ? _colorScheme : "${DEFAULT_COLOR_SCHEME}";
  var computedColorScheme = colorScheme !== "auto" ? colorScheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-mantine-color-scheme", computedColorScheme);
} catch (e) {}`;

export function ColorSchemeScript() {
  return (
    <script
      data-mantine-script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
