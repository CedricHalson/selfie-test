export class DataTypeValidator {
    public static isNotNullOrUndefined(value: any): boolean {
        return value !== undefined && value !== null
    }

    public static string(value: any, defaultValue = ""): string {
        if (value !== undefined && value !== null) return value.toString()
        return defaultValue
    }

    public static integer(value: any, defaultValue = 0): number {
        const integer = parseInt(DataTypeValidator.string(value), 10)
        return !isNaN(integer) ? integer : defaultValue
    }

    public static float(value: any, defaultValue = 0): number {
        const float = parseFloat(DataTypeValidator.string(value))
        return !isNaN(float) ? float : defaultValue
    }

    public static boolean(value: any): boolean {
        if (DataTypeValidator.isNotNullOrUndefined(value) && value !== false)
            return true
        return false
    }

    public static list(value: any, defaultValue = []): Array<any> {
        if (DataTypeValidator.isNotNullOrUndefined(value))
            return Array.from(value as Iterable<any>)
        return defaultValue
    }
}
