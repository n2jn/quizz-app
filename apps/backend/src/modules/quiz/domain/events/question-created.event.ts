import { DomainEvent } from '@shared/domain/base/domain-event.base';

export interface QuestionCreatedEventProps {
  questionId: string;
  categoryId: string;
  difficultyId: string;
  createdById: string;
  occurredAt: Date;
}

/**
 * Question Created Domain Event
 *
 * Published when a new question is created.
 * Other contexts can listen to update statistics, trigger notifications, etc.
 */
export class QuestionCreatedEvent extends DomainEvent {
  constructor(public readonly props: QuestionCreatedEventProps) {
    super('question.created');
  }

  getAggregateId(): string {
    return this.props.questionId;
  }

  get questionId(): string {
    return this.props.questionId;
  }

  get categoryId(): string {
    return this.props.categoryId;
  }

  get difficultyId(): string {
    return this.props.difficultyId;
  }

  get createdById(): string {
    return this.props.createdById;
  }
}
