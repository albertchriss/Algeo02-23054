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

export const PaginationControl = ({ totalPage, currentUrl }: PaginationControlProps) => {
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";

  return (
    <Pagination>
      <PaginationContent>
        {Number(page) > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`${currentUrl}page=${Number(page)-1}`} />
          </PaginationItem>
        )}
        {Number(page) > 1 && (
          <PaginationItem>
            <PaginationLink href={`${currentUrl}page=${Number(page)-1}`}>{Number(page) - 1}</PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href={`${currentUrl}page=${Number(page)}`}>{Number(page)}</PaginationLink>
        </PaginationItem>
        {Number(page) < totalPage && (
          <PaginationItem>
            <PaginationLink href={`${currentUrl}page=${Number(page)+1}`}>{Number(page) + 1}</PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {Number(page) < totalPage && (
          <PaginationItem>
              <PaginationNext href={`${currentUrl}page=${Number(page)+1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
