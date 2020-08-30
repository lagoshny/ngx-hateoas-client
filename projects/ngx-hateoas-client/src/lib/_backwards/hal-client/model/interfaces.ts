import { Resource } from '../../../model/resource/resource';

export interface HalParam {
  key: string;
  value: Resource | string | number | boolean;
}

export interface LinkOptions {
  strictParams?: boolean;
  params?: LinkParams;
}

export interface LinkParams {
  [paramName: string]: string;
}

export interface HalOptions {
  notPaged?: boolean;
  size?: number;
  sort?: OldSort[];
  params?: HalParam[];
}

export enum Include {
  NULL_VALUES = 'NULL_VALUES'
}

export interface ResourceOptions {
  include: Include;
  props: Array<string>;
}

export type OldSortOrder = 'DESC' | 'ASC';

export interface OldSort {
  path: string;
  order: OldSortOrder;
}

export interface OldSubTypeBuilder {
  subtypes: Map<string, any>;
}
