import { OldBaseResource } from './old-base-resource';

export class OldResource extends OldBaseResource {

    public getSelfLinkHref(): string {
        return this.getRelationLinkHref('self');
    }

}
