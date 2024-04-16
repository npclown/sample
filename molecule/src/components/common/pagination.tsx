import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const CustomPagination = ({
  query,
  page,
  totalCount,
  limit,
}: {
  query?: string;
  page: number;
  totalCount: number;
  limit: number;
}) => {
  const numPages = Math.ceil(totalCount / limit);
  const maxPageNumber = 5;
  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(numPages, page + 2);

  if (endPage - startPage < maxPageNumber - 1) {
    startPage = Math.max(1, endPage - (maxPageNumber - 1));
    endPage = Math.min(numPages, startPage + (maxPageNumber - 1));
  }

  return (
    <Pagination>
      <PaginationContent>
        {page > maxPageNumber - 2 && (
          <PaginationItem>
            <PaginationPrevious href={query ? `?${query}&page=${page - 3}` : `?page=${page - 3}`} />
          </PaginationItem>
        )}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((value: number) => (
          <PaginationItem key={value}>
            {value === page ? (
              <PaginationLink className="dark:bg-gray-400 dark:hover:bg-gray-500" href="#" isActive>
                {value}
              </PaginationLink>
            ) : (
              <PaginationLink
                className="dark:border dark:border-gray-400 dark:hover:bg-gray-500"
                href={query ? `?${query}&page=${value}` : `?page=${value}`}
              >
                {value}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        {page < numPages - 2 && (
          <PaginationItem>
            <PaginationNext href={query ? `?${query}&page=${page + 3}` : `?page=${page + 3}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
