export class ExcalidrawAutomator {
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isVisible(el: Element): boolean {
    const rect = (el as HTMLElement).getBoundingClientRect?.();
    return !!rect && rect.width > 0 && rect.height > 0;
  }

  private async clickByText(selector: string, regex: RegExp): Promise<HTMLElement> {
    const el = await this.tryClickByText(selector, regex);
    if (!el) throw new Error(`Could not find element ${selector} matching ${regex}`);
    return el;
  }

  private async tryClickByText(
    selector: string,
    regex: RegExp,
  ): Promise<HTMLElement | null> {
    const els = Array.from(document.querySelectorAll(selector)).filter((e) =>
      this.isVisible(e),
    );
    const el = els.find((e) =>
      regex.test((e.textContent || "").replace(/\s+/g, " ").trim()),
    );
    if (!el) return null;
    (el as HTMLElement).click();
    return el as HTMLElement;
  }

  private async findButton(
    predicate: (btn: HTMLButtonElement) => boolean,
  ): Promise<HTMLButtonElement> {
    const buttons = Array.from(document.querySelectorAll("button")).filter((e) =>
      this.isVisible(e),
    ) as HTMLButtonElement[];
    const btn = buttons.find(predicate);
    if (!btn) throw new Error("Could not find the expected Excalidraw button.");
    return btn;
  }

  private setEditorContent(value: string): void {
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

  private async openMermaidDialog(): Promise<void> {
    const menuTrigger =
      document.querySelector('button[aria-label*="menu" i]') ||
      document.querySelector('button[title*="menu" i]') ||
      document.querySelector('button[aria-label*="more" i]') ||
      document.querySelector('button[title*="more" i]') ||
      document.querySelector(".App-menu__left button") ||
      (await this.findButton((btn) => btn.textContent?.trim() === "⋮"));
    if (!menuTrigger) throw new Error("Could not find Excalidraw toolbar menu button.");

    (menuTrigger as HTMLElement).click();
    await this.sleep(250);
    await this.clickByText(
      "button",
      /mermaid\s*to\s*excalidraw|mermaid\s*to\s*diagram/i,
    );
    await this.sleep(350);
  }

  private async ensureMermaidTab(): Promise<void> {
    await this.tryClickByText("button", /^mermaid$/i);
    await this.sleep(200);

    if (
      !document.querySelector(".cm-content[contenteditable]") &&
      !document.querySelector("textarea")
    ) {
      throw new Error("Mermaid dialog editor not found.");
    }
  }

  private async insert(): Promise<void> {
    const insertBtn = Array.from(document.querySelectorAll("button"))
      .filter((b) => this.isVisible(b))
      .find((b) => /insert/i.test((b.textContent || "").replace(/\s+/g, " ").trim()));
    if (!insertBtn) throw new Error("Insert button not found in Mermaid dialog.");
    (insertBtn as HTMLElement).click();
  }

  async run(mermaid: string): Promise<void> {
    await this.openMermaidDialog();
    await this.ensureMermaidTab();
    this.setEditorContent(mermaid);
    await this.sleep(300);
    await this.insert();
  }
}

export async function sendToExcalidraw(mermaid: string): Promise<void> {
  await new ExcalidrawAutomator().run(mermaid);
}
