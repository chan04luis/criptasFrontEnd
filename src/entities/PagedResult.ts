export interface PagedResult<T>{
    TotalRecords:number;
    TotalPages:number;
    PageNumber:number;
    PageSize:number;
    Items: Array<T>;
}