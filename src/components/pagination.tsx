import { Button, IconButton } from "@material-tailwind/react";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
}: PaginationProps) => {
  const getItemProps = (index: number) =>
    ({
      variant: currentPage === index ? "filled" : "text",
      color: "gray",
      onClick: () => setCurrentPage(index),
    } as any);

  const next = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    // Always show the first page
    pages.push(1);

    // Add leading ellipsis if needed
    if (currentPage > 3) {
      pages.push("...");
    }

    // Add currentPage - 1, currentPage, currentPage + 1 (if within bounds)
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    // Add trailing ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show the last page if it's not already included
    if (totalPages !== 1) {
      pages.push(totalPages);
    }

    // Render
    return pages.map((page, idx) =>
      typeof page === "number" ? (
        <IconButton key={page} {...getItemProps(page)}>
          {page}
        </IconButton>
      ) : (
        <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
          ...
        </span>
      )
    );
  };

  return (
    <div className="my-2 flex items-center gap-4">
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={currentPage === 1}
        {...({} as any)}
      >
        <FaCircleArrowLeft size={20} />
      </Button>

      <div className="flex items-center gap-2">{renderPageNumbers()}</div>

      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={next}
        disabled={currentPage === totalPages}
        {...({} as any)}
      >
        <FaCircleArrowRight size={20} />
      </Button>
    </div>
  );
};

export default Pagination;
