function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Drives Excalidraw's own toolbar "⋯" menu -> "Mermaid to diagram",
// pastes the generated Mermaid, and clicks Insert.
export async function sendToExcalidraw(mermaid: string): Promise<void> {
  const menuTrigger =
    document.querySelector('button[aria-label="Main menu"]') ||
    document.querySelector(".App-menu__left button") ||
    document.querySelector('button[title="Main menu"]');
  if (!menuTrigger) throw new Error("Could not find Excalidraw main menu button.");

  (menuTrigger as HTMLElement).click();
  await sleep(300);

  const items = Array.from(document.querySelectorAll("button"));
  const mermaidItem = items.find((b) => /mermaid\s*to\s*diagram/i.test(b.textContent || ""));
  if (!mermaidItem) throw new Error("Could not find 'Mermaid to diagram' menu item.");

  (mermaidItem as HTMLElement).click();
  await sleep(400);

  const textarea = document.querySelector("textarea");
  if (!textarea) throw new Error("Mermaid dialog textarea not found.");

  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value",
  )!.set!;
  setter.call(textarea, mermaid);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  await sleep(300);

  const insertBtn = Array.from(document.querySelectorAll("button")).find((b) =>
    /^insert$/i.test((b.textContent || "").trim()),
  );
  if (!insertBtn) throw new Error("Insert button not found in Mermaid dialog.");

  (insertBtn as HTMLElement).click();
}
