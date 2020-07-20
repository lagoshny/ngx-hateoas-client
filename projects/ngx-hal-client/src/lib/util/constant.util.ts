import { PageParam } from '../hal-resource/model/declarations';

export class ConstantUtil {
  public static readonly DEFAULT_PAGE: PageParam = {
    page: 0,
    size: 20,
  };
}
