import { BaseResource } from './base-resource';

/**
 * Using for model classes that it's not Resource but can hold Resources as property, for example is Embeddable entity.
 * A distinctive feature of such resources is that they do not have <b>self</b> link while {@link Resource} has.
 *
 * Sample:
 * class Product extends Resource {
 *   name: string;
 * }
 *
 * class CartItem extends EmbeddedResource { //it is not Resource, just embedded object
 *   product: Product;
 * }
 */
export class EmbeddedResource extends BaseResource {
}
