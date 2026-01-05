interface DropdownItem {
    name: string;
    path: string;
}

interface BrandItem {
    name: string;
    path: string;
    image?: string;  
}

interface MainDropdownProps {
    title?: string;
    path: string;
    categories?: DropdownItem[];    // Danh mục
    brands?: BrandItem[];           // Thương hiệu
    popularSearches?: DropdownItem[]; // Tìm kiếm nhiều
}

export type { MainDropdownProps };