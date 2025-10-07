export interface IQuery<T> {
  limit?: string;
  page?: string;
  sort?: Partial<Record<keyof T, 1 | -1>>;
  q?: string;
  top?: string;
  f?: string; // media type
  pf?: string; // people follow

  user_id?: string;
  ishl?: "1" | "0";
}
