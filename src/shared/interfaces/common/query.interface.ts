export interface IQuery<T> {
  limit?: string;
  page?: string;
  sort?: Partial<Record<keyof T, 1 | -1>>;
  q?: string;
  t?: "top";
  f?: "media"; // trả về những tweet có media
  pf?: string; // people follow
  sd?: Date;
  ed?: Date;

  // Profile
  user_id?: string;
  ishl?: "1" | "0";
  ids?: string[];

  top?: string;
}
