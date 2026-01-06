interface SearchProps {
    width?: string;
    showOnMobile?: boolean;
}

export const Search = ({
    width = "lg:w-5/12",
    showOnMobile = false,
}: SearchProps) => {
    return (
        <div
            className={`
        ${showOnMobile ? "flex" : "hidden"}
        lg:flex
        ${width}
        items-center
        bg-white/20
        rounded-md
        px-3
        pr-0
        w-full
      `}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-300"
            >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
                type="text"
                className="p-2 w-full bg-transparent placeholder:text-gray-300 outline-none border-none text-white"
                placeholder="Tìm kiếm..."
            />

            <button
                className="
                    bg-primary-700
                    min-w-max
                    px-4
                    py-2
                    rounded
                    text-white
                    ml-2
                    hover:bg-accent-700
                    flex
                    items-center
                    gap-2
                "
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 lg:hidden"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>

                <span className="hidden lg:inline">Tìm kiếm</span>
            </button>

        </div>
    );
};
