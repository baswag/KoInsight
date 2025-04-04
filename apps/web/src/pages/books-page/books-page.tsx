import { Book } from '@kobuddy/common/types/book';
import { Button, Flex, Group, Loader, Select, TextInput, Title, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import {
  IconArrowsDownUp,
  IconCards,
  IconSortAscending,
  IconSortDescending,
  IconTable,
  IconX,
} from '@tabler/icons-react';
import { JSX, useState } from 'react';
import { useBooks } from '../../api/use-books';
import { BooksCards } from './books-cards';
import { BooksTable } from './books-table';

export function BooksPage(): JSX.Element {
  const [mode, setMode] = useLocalStorage<'table' | 'cards'>({
    key: 'kobuddy-books-search',
    defaultValue: 'table',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useLocalStorage<{ key: keyof Book; direction: 'asc' | 'desc' }>({
    key: 'kobuddy-books-sort',
    defaultValue: {
      key: 'last_open',
      direction: 'desc',
    },
  });

  const { data: books, isLoading, error } = useBooks();

  const visibleBooks =
    searchTerm.length === 0
      ? (books ?? [])
      : (books ?? []).filter((book) =>
          [book.title, book.authors, book.series]
            .map((value) => value?.toLowerCase())
            .some((v) => v?.includes(searchTerm.toLowerCase()))
        );

  const sortedBooks = visibleBooks.sort((a, b) => {
    const { key: sort, direction } = sortBy;
    const aVal = a[sort];
    const bVal = b[sort];

    if (aVal === null) {
      return 1;
    }

    if (bVal === null) {
      return -1;
    }

    const dir = direction === 'asc' ? 1 : -1;
    if (aVal < bVal) {
      return -1 * dir;
    }
    if (aVal > bVal) {
      return 1 * dir;
    }

    return 0;
  });

  if (error) {
    return <Flex justify="center">Failed to load books</Flex>;
  }

  if (isLoading || !books) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Loader />
      </Flex>
    );
  }

  if (books.length === 0) {
    return <Flex justify="center">No books found</Flex>;
  }

  return (
    <>
      <Title mb="xl">Books</Title>
      <Flex justify="space-between" mb="xl">
        <TextInput
          placeholder="Search books..."
          w={300}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          rightSection={
            searchTerm.length > 0 ? (
              <IconX size={14} onClick={() => setSearchTerm('')} style={{ cursor: 'pointer' }} />
            ) : null
          }
        />
        <Group justify="center" align="center">
          <Button
            variant="outline"
            onClick={() =>
              setSortBy({
                key: sortBy.key,
                direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
              })
            }
          >
            {sortBy.direction === 'asc' ? (
              <IconSortAscending size={18} />
            ) : (
              <IconSortDescending size={18} />
            )}
          </Button>
          <Select
            leftSection={<IconArrowsDownUp size={16} />}
            w={150}
            value={sortBy.key}
            allowDeselect={false}
            onChange={(value) => setSortBy((prev) => ({ ...prev, key: value as keyof Book }))}
            data={
              [
                { label: 'Added', value: 'id' },
                { label: 'Title', value: 'title' },
                { label: 'Author', value: 'authors' },
                { label: 'Read time', value: 'total_read_time' },
                { label: 'Last open', value: 'last_open' },
              ] as { label: string; value: keyof Book }[]
            }
            defaultValue="title"
          />
          <Button.Group variant="outline">
            <Tooltip label="Table view" position="top" withArrow>
              <Button
                variant={mode === 'table' ? 'primary' : 'outline'}
                onClick={() => setMode('table')}
              >
                <IconTable size={16} />
              </Button>
            </Tooltip>
            <Tooltip label="Cards view" position="top" withArrow>
              <Button
                variant={mode === 'cards' ? 'primary' : 'outline'}
                onClick={() => setMode('cards')}
              >
                <IconCards size={16} />
              </Button>
            </Tooltip>
          </Button.Group>
        </Group>
      </Flex>
      {mode === 'table' ? <BooksTable books={sortedBooks} /> : <BooksCards books={sortedBooks} />}
    </>
  );
}
