import { HalPageParam } from '../hal-resource/model/paged-collection-resource';

export class ConstantUtil {
  public static readonly DEFAULT_PAGE: HalPageParam = {
    page: 0,
    size: 20,
  };
}
