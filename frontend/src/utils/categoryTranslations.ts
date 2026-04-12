export const CATEGORY_LABELS: Record<string, string> = {
  WEAPON: '무기',
  ARMOR: '방어구',
  TOOL: '도구',
  COSMETIC: '치장품',
  TITLE: '칭호',
  BLOCK: '블록',
  REDSTONE_DEVICES: '레드스톤 장치',
  ORE: '광석',
  GROWTH_GOODS: '성장 재화',
  ETC: '기타'
};

export const translateCategory = (category: string): string => {
  return CATEGORY_LABELS[category] || category;
};
