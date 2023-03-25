import axios from 'axios';
import { describe, expect, test, jest } from '@jest/globals';
import { getMonsters } from '../axios.js';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

interface GetMonstersResponseSchema {
  count: number;
  results: [
    {
      index: string;
      name: string;
      url: string;
    }
  ];
}

describe('getMonsters', () => {
  test('should return schema', async () => {
    const data = {
      count: 25,
      results: [
        {
          index: 'animated-armor',
          name: 'Animated Armor',
          url: '/api/monsters/animated-armor',
        },
      ],
    } as GetMonstersResponseSchema;
    mockedAxios.get.mockResolvedValue({ data: data });

    const result = await getMonsters();
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    expect(result).toStrictEqual({
      count: 25,
      results: [
        {
          index: 'animated-armor',
          name: 'Animated Armor',
          url: '/api/monsters/animated-armor',
        },
      ],
    });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://www.dnd5eapi.co/api/monsters'
    );
    expect(result).toEqual(data);
  });
});
