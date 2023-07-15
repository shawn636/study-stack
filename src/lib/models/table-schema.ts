export default interface TableSchema {
    field: string;
    type: string;
    nullable: string;
    constaint_name: string | null;
    default_value: unknown;
    extra: string;
}
