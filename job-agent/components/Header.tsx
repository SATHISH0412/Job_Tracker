import Link from "next/link";

/**
 * The product name, declared once. `app/layout.tsx` imports it for the
 * document title so the two can never drift.
 *
 * `JobFinder` is the section 8 mockup name. `04-private-access-and-handoff`
 * task 4.4 is where the final name is agreed, and it changes here only.
 */
export const APP_NAME = "JobFinder";

type NavItem = {
  readonly label: string;
  /**
   * `null` marks a future-only item: still rendered, but with nothing to
   * navigate to, so it cannot be activated.
   */
  readonly href: string | null;
  /**
   * Static for V1. Task 2.1 explicitly puts active-route highlighting out of
   * scope, so `Search` is marked current on every page.
   */
  readonly isCurrent?: boolean;
};

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Search", href: "/", isCurrent: true },
  { label: "Jobs", href: "/jobs" },
  { label: "Saved", href: null },
  { label: "Settings", href: null },
];

// `min-h-11` keeps every nav item at a 44px tap target on touch.
const NAV_ITEM_CLASS = "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium";
const NAV_ITEM_ENABLED_CLASS = `${NAV_ITEM_CLASS} text-foreground hover:bg-foreground/5`;
const NAV_ITEM_CURRENT_CLASS = `${NAV_ITEM_CLASS} bg-foreground/10 text-foreground`;
const NAV_ITEM_DISABLED_CLASS = `${NAV_ITEM_CLASS} cursor-not-allowed text-foreground/35`;

/**
 * Shared header for every page.
 *
 * A Server Component: the whole thing is static text and links, so it ships
 * no JavaScript. The mobile reflow is a wrapping flex row, not a JS-driven
 * disclosure, which keeps that true.
 */
export default function Header() {
  return (
    <header className="border-b">
      <div className="app-container">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            {APP_NAME}
          </Link>

          <nav
            aria-label="Primary"
            className="order-last w-full sm:order-none sm:w-auto sm:flex-1"
          >
            <ul className="flex flex-wrap items-center gap-x-1 gap-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  {item.href === null ? (
                    <span
                      role="link"
                      aria-disabled="true"
                      className={NAV_ITEM_DISABLED_CLASS}
                    >
                      {item.label}
                      <span className="sr-only"> (coming soon)</span>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={item.isCurrent ? "page" : undefined}
                      className={
                        item.isCurrent
                          ? NAV_ITEM_CURRENT_CLASS
                          : NAV_ITEM_ENABLED_CLASS
                      }
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Static slot only — the real profile menu is task 4.2's job. */}
          <span className="ml-auto inline-flex min-h-11 items-center rounded-md border border-foreground/20 px-3 text-sm text-foreground/60">
            Profile
          </span>
        </div>
      </div>
    </header>
  );
}
