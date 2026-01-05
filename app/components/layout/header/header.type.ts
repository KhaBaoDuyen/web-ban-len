export type HeaderType = {
    name: string;
    path: string;
    image?: string;
};

export type HeaderGroup = {
    title?: string;
    path: string;
    categories?: HeaderType[];
    brands?: HeaderType[];
    popularSearches?: HeaderType[];
}  