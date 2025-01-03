import { Flex, Table } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { endOfDay, formatDate, startOfDay } from 'date-fns';
import { apply } from 'ramda';
import { JSX, useState } from 'react';
import { BookWithStats } from '../../api/use-book-with-stats';
import { formatSecondsToHumanReadable } from '../../utils/dates';

type BookPageRawProps = {
  book: BookWithStats;
};

export function BookPageRaw({ book }: BookPageRawProps): JSX.Element {
  const dates = book.stats.map((stat) => stat.start_time);
  const min = new Date(apply(Math.min, dates) * 1000);
  const max = new Date(apply(Math.max, dates) * 1000);

  const [startDate, setStartDate] = useState(min);
  const [endDate, setEndDate] = useState(max);

  const visibleEvents = book.stats.filter(
    (stat) =>
      stat.start_time >= startDate.getTime() / 1000 && stat.start_time <= endDate.getTime() / 1000
  );

  return (
    <Flex direction="column" gap={20}>
      <Flex gap={8}>
        <DateInput
          label="Start date"
          value={startDate}
          onChange={(e) => setStartDate(startOfDay(e!))}
          minDate={min}
          maxDate={endDate}
        />
        <DateInput
          label="End date"
          value={endDate}
          onChange={(e) => setEndDate(endOfDay(e!))}
          minDate={startDate}
          maxDate={max}
        />
      </Flex>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Page</Table.Th>
            <Table.Th>Start time</Table.Th>
            <Table.Th>Duration</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {visibleEvents.map((stat) => (
            <Table.Tr key={stat.start_time}>
              <Table.Td>{stat.page}</Table.Td>
              <Table.Td>{formatDate(stat.start_time * 1000, 'dd LLL yyyy, HH:mm:ss')}</Table.Td>
              <Table.Td>{formatSecondsToHumanReadable(stat.duration, false)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Flex>
  );
}
