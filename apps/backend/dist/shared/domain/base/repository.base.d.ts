import { AggregateRoot } from './aggregate-root.base';
export interface IRepository<T extends AggregateRoot> {
    findById(id: string): Promise<T | null>;
    save(aggregate: T): Promise<void>;
    delete(id: string): Promise<void>;
}
