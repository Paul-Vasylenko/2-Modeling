export enum ClientType {
  "CHECKED" = 1,
  "SICK_NOT_CHECKED" = 2,
  "TO_BE_CHECKED" = 3,
}

export interface IClientType {
  type: ClientType;
  freq: number;
  meanTime: number;
  priority: number;
}
