import { singleAllocationToArray } from '../../common/tools/object';

describe('singleAllocationToArray', () => {
  test('single allocation average should work', () => {
    const withAllocation1 = {
      value: 1,
      allocation: 0.6,
    };

    const ref = [{}, {}, {}];

    const res = singleAllocationToArray(
      [withAllocation1],
      ref,
      'allocation',
      'average',
    );

    expect(res).toHaveLength(1);
    expect(res[0].value).toEqual(1);
    expect(res[0].allocation).toHaveLength(ref.length);
    expect(res[0].allocation?.[0]).toBeCloseTo(withAllocation1.allocation / 3);
    expect(res[0].allocation?.[1]).toBeCloseTo(withAllocation1.allocation / 3);
    expect(res[0].allocation?.[2]).toBeCloseTo(withAllocation1.allocation / 3);
  });

  test('single allocation but array should do nothing', () => {
    const withAllocation1 = {
      value: 1,
      allocation: [0.2, 0.2, 0.2],
    };

    const ref = [{}, {}, {}];

    const res = singleAllocationToArray(
      [withAllocation1],
      ref,
      'allocation',
      'average',
    );

    expect(res).toHaveLength(1);
    expect(res[0].value).toEqual(1);
    expect(res[0].allocation).toHaveLength(ref.length);
    expect(res[0].allocation?.[0]).toBeCloseTo(withAllocation1.allocation[0]);
    expect(res[0].allocation?.[1]).toBeCloseTo(withAllocation1.allocation[1]);
    expect(res[0].allocation?.[2]).toBeCloseTo(withAllocation1.allocation[2]);
  });
});
