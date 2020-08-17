import { BaseResource } from './base-resource';

/**
 * Using for model classes that it's not Resource but can hold Resources as property, for example is Embeddable entity.
 * A distinctive feature of such resources is that they do not have the <b>self</b> link while {@link Resource} has.
 * It's related with that Embeddable entity can't have an id property.
 *
 * Usage example:
 *
 * // Regular resource
 * class Product extends Resource {
 *   name: string;
 * }
 *
 * // EmbeddedResource that holds Product resource.
 * class CartItem extends EmbeddedResource {
 *   product: Product;
 * }
 */
export class EmbeddedResource extends BaseResource {
}
