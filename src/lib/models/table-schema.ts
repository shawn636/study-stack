export default interface TableSchema {
    constaint_name: null | string;
    default_value: unknown;
    extra: string;
    field: string;
    nullable: string;
    type: string;
}
