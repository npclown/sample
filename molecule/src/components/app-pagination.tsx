import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AppPagination({
  page,
  setPage,
  totalCount,
}: {
  page: number;
  setPage: any;
  totalCount: number;
}) {
  return (
    <Pagination>
      <PaginationContent>
        {page !== 1 ? (
          <PaginationItem>
            <PaginationPrevious href={`?page=${page - 1}`} onClick={(e) => setPage(page - 1)} />
          </PaginationItem>
        ) : null}

        {page - 1 > 1 ? (
          <PaginationItem>
            <PaginationLink href={`?page=${page - 2}`} className="cursor-pointer" onClick={(e) => setPage(page - 2)}>
              {page - 2}
            </PaginationLink>
          </PaginationItem>
        ) : null}

        {page > 1 ? (
          <PaginationItem>
            <PaginationLink href={`?page=${page - 1}`} className="cursor-pointer" onClick={(e) => setPage(page - 1)}>
              {page - 1}
            </PaginationLink>
          </PaginationItem>
        ) : null}

        <PaginationItem>
          <PaginationLink href="#" isActive>
            {page}
          </PaginationLink>
        </PaginationItem>

        {page * 15 < totalCount && (
          <>
            <PaginationItem>
              <PaginationLink href={`?page=${page + 1}`} className="cursor-pointer" onClick={(e) => setPage(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {(page + 1) * 15 < totalCount && (
          <>
            <PaginationItem>
              <PaginationLink href={`?page=${page + 2}`} className="cursor-pointer" onClick={(e) => setPage(page + 2)}>
                {page + 2}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {(page + 2) * 15 < totalCount && (
          <>
            <PaginationItem>
              <PaginationNext href={`?page=${page + 1}`} onClick={(e) => setPage(page + 1)} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
