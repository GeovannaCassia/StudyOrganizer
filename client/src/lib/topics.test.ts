import { describe, expect, it } from 'vitest';
import type { Topic } from '@/types/topic';
import { filterTopics, sortTopics, topicsProgress } from './topics';

const topic = (id: number, isCompleted: boolean): Topic => ({
  id,
  title: `Tópico ${id}`,
  description: null,
  isCompleted,
  subjectId: 1,
});

const topics = [topic(3, true), topic(4, false), topic(1, false), topic(2, true)];

describe('sortTopics', () => {
  it('põe os pendentes primeiro e mantém a ordem de criação em cada grupo', () => {
    expect(sortTopics(topics).map((t) => t.id)).toEqual([1, 4, 2, 3]);
  });

  it('não altera a lista original', () => {
    sortTopics(topics);
    expect(topics.map((t) => t.id)).toEqual([3, 4, 1, 2]);
  });
});

describe('filterTopics', () => {
  it.each([
    ['todos', [3, 4, 1, 2]],
    ['pendentes', [4, 1]],
    ['concluidos', [3, 2]],
  ] as const)('%s', (filter, ids) => {
    expect(filterTopics(topics, filter).map((t) => t.id)).toEqual(ids);
  });
});

describe('topicsProgress', () => {
  it.each([
    [0, 0, 0],
    [0, 3, 0],
    [2, 3, 66.67],
    [3, 3, 100],
  ])('%i de %i → %d', (completed, total, expected) => {
    expect(topicsProgress(completed, total)).toBe(expected);
  });
});
