function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isVisible(el: Element): boolean {
  const html = el as HTMLElement;
  const rect = html.getBoundingClientRect?.();
  return !!rect && rect.width > 0 && rect.height > 0;
}

async function clickByText(
  selector: string,
  regex: RegExp,
): Promise<HTMLElement> {
  const els = Array.from(document.querySelectorAll(selector)).filter(isVisible);
  const el = els.find((e) => regex.test((e.textContent || "").replace(/\s+/g, " ").trim()));
  if (!el) throw new Error(`Could not find element ${selector} matching ${regex}`);
  (el as HTMLElement).click();
  return el as HTMLElement;
}

async function findButton(
  predicate: (btn: HTMLButtonElement) => boolean,
): Promise<HTMLButtonElement> {
  const buttons = Array.from(document.querySelectorAll("button")).filter(isVisible) as HTMLButtonElement[];
  const btn = buttons.find(predicate);
  if (!btn) throw new Error("Could not find the expected Excalidraw button.");
  return btn;
}

// Replace the contents of a CodeMirror 6 editor (.cm-content, contenteditable)
// by selecting all and inserting via execCommand so React/CM receive proper
// input events. Falls back to a plain textarea if no CM editor is present.
function setEditorContent(value: string) {
  const cm = document.querySelector<HTMLElement>(".cm-content[contenteditable]");
  if (cm) {
    cm.focus();
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(cm);
    sel?.removeAllRanges();
    sel?.addRange(range);
    document.execCommand("insertText", false, value);
    cm.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  const textarea = document.querySelector("textarea");
  if (!textarea) throw new Error("Mermaid editor not found.");
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value",
  )!.set!;
  setter.call(textarea, value);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

// Drives Excalidraw's own toolbar "⋯" menu -> "Mermaid to diagram",
// switches to the Mermaid tab, pastes the generated Mermaid into the
// CodeMirror editor, and clicks Insert.
export async function sendToExcalidraw(mermaid: string): Promise<void> {
  const menuTrigger =
    document.querySelector('button[aria-label*="menu" i]') ||
    document.querySelector('button[title*="menu" i]') ||
    document.querySelector('button[aria-label*="more" i]') ||
    document.querySelector('button[title*="more" i]') ||
    document.querySelector(".App-menu__left button") ||
    (await findButton((btn) => btn.textContent?.trim() === "⋮"));
  if (!menuTrigger) throw new Error("Could not find Excalidraw toolbar menu button.");

  (menuTrigger as HTMLElement).click();
  await sleep(250);

  await clickByText("button", /mermaid\s*to\s*excalidraw|mermaid\s*to\s*diagram/i);
  await sleep(350);

  // Ensure the Mermaid tab (not "Text to Diagram") is active.
  try {
    await clickByText("button", /^mermaid$/i);
    await sleep(200);
  } catch {
    // Already on the Mermaid tab or no tab switcher.
  }

  if (
    !document.querySelector(".cm-content[contenteditable]") &&
    !document.querySelector("textarea")
  ) {
    throw new Error("Mermaid dialog editor not found.");
  }

  setEditorContent(mermaid);
  await sleep(300);

  const insertBtn = Array.from(document.querySelectorAll("button"))
    .filter(isVisible)
    .find((b) => /insert/i.test((b.textContent || "").replace(/\s+/g, " ").trim()));
  if (!insertBtn) throw new Error("Insert button not found in Mermaid dialog.");

  (insertBtn as HTMLElement).click();
}
