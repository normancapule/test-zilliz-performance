import { Queue } from "async-await-queue";

const BATCH_COUNT = 100;

export const batchCallPromises = async <T, X>(
  elements: T[],
  iteratorFn: (a: T, index?: number) => Promise<X>
) => {
  const queue = new Queue(BATCH_COUNT);
  const queues = elements.map(async (e, index) => {
    const id = Symbol();
    await queue.wait(id, 0);
    try {
      return await iteratorFn(e, index);
    } finally {
      queue.end(id);
    }
  });

  try {
    return await Promise.all(queues);
  } finally {
    await queue.flush();
  }
};
