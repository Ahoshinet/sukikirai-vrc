import type { IconType } from "react-icons";
import { TbShirt, TbUser, TbUsersGroup, TbWorld } from "react-icons/tb";

import type { CategoryKey } from "../lib/categories";

const ICONS: Record<CategoryKey, IconType> = {
  user: TbUser,
  avatar: TbShirt,
  world: TbWorld,
  group: TbUsersGroup,
};

export function CategoryIcon({
  category,
  size = 18,
}: {
  category: CategoryKey;
  size?: number;
}) {
  const Icon = ICONS[category];
  return <Icon size={size} />;
}
