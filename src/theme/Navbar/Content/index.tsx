import React, { type ReactNode } from "react";
import clsx from "clsx";
import {
  ErrorCauseBoundary,
  ThemeClassNames,
  useThemeConfig,
} from "@docusaurus/theme-common";
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal";
import NavbarItem, { type Props as NavbarItemConfig } from "@theme/NavbarItem";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import NavbarLogo from "@theme/Navbar/Logo";
import NavbarMobileSidebarToggle from "@theme/Navbar/MobileSidebar/Toggle";
import SearchNavbarItem from "@site/src/theme/NavbarItem/SearchNavbarItem";

type ThemeConfigWithNavbarItems = {
  navbar?: {
    items?: NavbarItemConfig[];
  };
};

type NavbarItemsProps = Readonly<{
  items: readonly NavbarItemConfig[];
}>;

type NavbarContentLayoutProps = Readonly<{
  left: ReactNode;
  right: ReactNode;
}>;

function useNavbarItems(): NavbarItemConfig[] {
  const { navbar } = useThemeConfig() as ThemeConfigWithNavbarItems;

  return navbar?.items ?? [];
}

function getNavbarItemKey(item: NavbarItemConfig): string {
  if ("label" in item && typeof item.label === "string") {
    return item.label;
  }

  if ("href" in item && typeof item.href === "string") {
    return item.href;
  }

  if ("to" in item && typeof item.to === "string") {
    return item.to;
  }

  if ("type" in item && typeof item.type === "string") {
    return item.type;
  }

  return JSON.stringify(item);
}

function NavbarItems({ items }: NavbarItemsProps): ReactNode {
  const keyCounts = new Map<string, number>();

  return (
    <>
      {items.map((item) => {
        const baseKey = getNavbarItemKey(item);
        const occurrence = keyCounts.get(baseKey) ?? 0;
        keyCounts.set(baseKey, occurrence + 1);
        const key = occurrence === 0 ? baseKey : `${baseKey}:${occurrence}`;

        return (
          <ErrorCauseBoundary
            key={key}
            onError={(error) =>
              new Error(
                `A theme navbar item failed to render.\nPlease double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:\n${JSON.stringify(item, null, 2)}`,
                { cause: error },
              )
            }
          >
            <NavbarItem {...item} />
          </ErrorCauseBoundary>
        );
      })}
    </>
  );
}

function NavbarContentLayout({
  left,
  right,
}: NavbarContentLayoutProps): React.JSX.Element {
  return (
    <div className="navbar__inner">
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerLeft,
          "navbar__items",
        )}
      >
        {left}
      </div>
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          "navbar__items navbar__items--right",
        )}
      >
        {right}
      </div>
    </div>
  );
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);

  return (
    <NavbarContentLayout
      left={
        <>
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <NavbarLogo />
          <NavbarItems items={leftItems} />
        </>
      }
      right={
        <>
          <NavbarItems items={rightItems} />
          <SearchNavbarItem />
          <NavbarColorModeToggle />
        </>
      }
    />
  );
}
