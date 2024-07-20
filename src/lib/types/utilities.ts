export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
