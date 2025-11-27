import { AggregateRoot } from './aggregate-root.base';

/**
 * Base Repository interface
 *
 * Repositories are responsible for persisting and retrieving aggregates.
 * This is a generic interface that all repositories should implement.
 */
export interface IRepository<T extends AggregateRoot> {
  findById(id: string): Promise<T | null>;
  save(aggregate: T): Promise<void>;
  delete(id: string): Promise<void>;
}
