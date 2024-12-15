"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

interface PaginationControlProps {
  totalPage: number;
  currentUrl: string;
}

export const PaginationControl = ({
  totalPage,
  currentUrl,
}: PaginationControlProps) => {
  const searchParams = useSearchParams();

  let page = searchParams.get("page") ?? "1";

  if (Number(page) > totalPage) {
    page = totalPage.toString();
  }
  else if (Number(page) < 1) {
    page = "1";
  }
  
  const search = searchParams.get("q") ?? "";
  const q = search.length > 0 ? `&q=${search}` : "";

  return (
    <Pagination className="mt-3">
      <PaginationContent>
        {Number(page) > 1 && (
          <PaginationItem>
            <PaginationPrevious
              className="hover:text-cyan-tua/50 transition-all duration-200 hover:bg-inherit"
              href={`${currentUrl}page=${Number(page) - 1}${q}`}
            />
          </PaginationItem>
        )}
        {Number(page) > 2 && (
          <>
            <PaginationItem>
              <PaginationLink
                href={`${currentUrl}page=${1}${q}`}
                className="hover:text-cyan-tua/50 transition-all duration-200 hover:bg-inherit"
              >
                {"1"}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {Number(page) > 1 && (
          <PaginationItem>
            <PaginationLink
              href={`${currentUrl}page=${Number(page) - 1}${q}`}
              className="hover:text-cyan-tua/50 transition-all duration-200 hover:bg-inherit"
            >
              {Number(page) - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            href={`${currentUrl}page=${Number(page)}${q}`}
            className="text-cyan-tua drop-shadow-lg hover:bg-inherit hover:text-cyan-tua"
          >
            {Number(page)}
          </PaginationLink>
        </PaginationItem>
        {Number(page) < totalPage && (
          <PaginationItem>
            <PaginationLink
              href={`${currentUrl}page=${Number(page) + 1}${q}`}
              className="hover:text-cyan-tua/50 transition-all duration-200 hover:bg-inherit"
            >
              {Number(page) + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {Number(page) < totalPage - 1 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href={`${currentUrl}page=${totalPage}${q}`}
                className="hover:text-cyan-tua/50 transition-all duration-200 hover:bg-inherit"
              >
                {totalPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={`${currentUrl}page=${Number(page) + 1}&q=${q}`}
                className="hover:text-cyan-tua/50 transition-all duration-200 hover:bg-inherit"
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
};
