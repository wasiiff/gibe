import type { CodeBundle } from "@/lib/types";

const OPENING_BODY = /<body[^>]*>/i;
const CLOSING_BODY = /<\/body>/i;
const FULL_DOCUMENT = /<!doctype|<html[^>]*>/i;
const SCRIPT_TAG = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const STYLE_TAG = /<style[\s\S]*?>[\s\S]*?<\/style>/gi;

function normalizeHtmlFragment(html: string) {
  if (!FULL_DOCUMENT.test(html)) {
    return html;
  }

  const opening = html.search(OPENING_BODY);
  const closing = html.search(CLOSING_BODY);

  if (opening >= 0 && closing > opening) {
    const bodyStart = html.slice(opening).match(OPENING_BODY)?.[0].length ?? 0;
    return html.slice(opening + bodyStart, closing);
  }

  return html;
}

function escapeForInlineScript(value: string) {
  return value.replace(/<\/script/gi, "<\\/script");
}

export function buildPreviewDocument(bundle: CodeBundle) {
  const html = normalizeHtmlFragment(bundle.html)
    .replace(SCRIPT_TAG, "")
    .replace(STYLE_TAG, "");
  const css = bundle.css;
  const js = escapeForInlineScript(bundle.js);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none'; img-src https: data: blob:; media-src https: data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src https:; font-src https: data:;"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      html, body { margin: 0; min-height: 100%; background: #050816; color: #f5f7ff; font-family: ui-sans-serif, system-ui, sans-serif; }
    </style>
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>
      const postToParent = (type, payload = {}) => {
        parent.postMessage({ source: "gibe-preview", type, ...payload }, "*");
      };

      window.addEventListener("error", (event) => {
        postToParent("runtime-error", {
          message: event.message,
          stack: event.error?.stack ?? null,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      });

      window.addEventListener("unhandledrejection", (event) => {
        const reason = event.reason;
        postToParent("runtime-error", {
          message: reason?.message ?? String(reason),
          stack: reason?.stack ?? null,
        });
      });

      const originalConsoleError = console.error.bind(console);
      console.error = (...args) => {
        postToParent("console-error", {
          message: args
            .map((value) => {
              if (typeof value === "string") return value;
              try {
                return JSON.stringify(value);
              } catch {
                return String(value);
              }
            })
            .join(" "),
        });
        originalConsoleError(...args);
      };

      window.addEventListener("DOMContentLoaded", () => {
        postToParent("ready");
      });
    </script>
    <script>${js}</script>
  </body>
</html>`;
}
