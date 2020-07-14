export class ObjectUtils {

    public static getClassName(obj: any): string {
        const funcNameRegex = /function (.+?)\(/;
        const results = (funcNameRegex).exec(obj.constructor.toString());
        return (results && results.length > 1) ? results[1] : '';
    }

    public static className(objProto: any): string[] {
        const classNames = [];
        let obj = Object.getPrototypeOf(objProto);

        while (ObjectUtils.getClassName(obj) !== 'Object') {
            classNames.push(ObjectUtils.getClassName(obj));
            obj = Object.getPrototypeOf(obj);
        }

        return classNames;
    }

    public static isNullOrUndefined(value: any): boolean {
        return value === null || value === undefined;
    }

    public static isPrimitive(value: any): boolean {
        return (typeof value !== 'object' && typeof value !== 'function') || value === null;
    }

    public static clone(value: any): any {
        return Object.assign(Object.create(Object.getPrototypeOf(value)), value);
    }

}
