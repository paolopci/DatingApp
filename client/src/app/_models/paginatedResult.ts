import { Paginator } from "./pagination";

export class PaginatedResult<T> {
    items?: T;
    pagination?: Paginator;
}