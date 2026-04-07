/**
 * 带并发限制的批量异步执行。
 *
 * @param items     - 待处理的元素列表
 * @param fn        - 对每个元素执行的异步函数
 * @param concurrency - 最大并发数，<= 0 表示不限制（全部同时执行）
 * @returns 与 items 等长的结果数组，顺序一一对应
 */
export async function asyncPool<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  concurrency = -1,
): Promise<R[]> {
  if (items.length === 0) {
    return [];
  }

  const results: R[] = new Array(items.length);

  if (concurrency <= 0) {
    await Promise.all(
      items.map(async (item, i) => {
        results[i] = await fn(item, i);
      }),
    );
    return results;
  }

  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx], idx);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}
