export interface Comment {
  id: string;
  author: string;
  email: string;
  homepage?: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
  level: number;
}

export const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Anonym',
    email: 'anonym@example.com',
    homepage: 'https://anonym.com',
    avatar: '👤',
    content: 'Есть основной комментарий',
    timestamp: '22.05.22 в 22:30',
    likes: 0,
    dislikes: 0,
    level: 0,
    replies: [
      {
        id: '1-1',
        author: 'Rum_8',
        email: 'rum8@example.com',
        avatar: '👤',
        content: 'Ответ на основной комментарий',
        timestamp: '22.05.22 в 22:43',
        likes: 0,
        dislikes: 0,
        level: 1,
        replies: [
          {
            id: '1-1-1',
            author: 'Anonym',
            email: 'anonym@example.com',
            avatar: '👤',
            content: 'Ответ на ответ',
            timestamp: '22.05.22 в 23:21',
            likes: 0,
            dislikes: 0,
            level: 2,
            replies: [
              {
                id: '1-1-1-1',
                author: 'User123',
                email: 'user123@example.com',
                avatar: '👤',
                content: 'Глубокий ответ',
                timestamp: '23.05.22 в 10:15',
                likes: 0,
                dislikes: 0,
                level: 3,
                replies: [],
              },
              {
                id: '1-1-1-2',
                author: 'Admin',
                email: 'admin@example.com',
                avatar: '👤',
                content: 'Еще один глубокий ответ',
                timestamp: '23.05.22 в 11:30',
                likes: 0,
                dislikes: 0,
                level: 3,
                replies: [],
              },
            ],
          },
        ],
      },
      {
        id: '1-2',
        author: 'Moderator',
        email: 'moderator@example.com',
        avatar: '👤',
        content: 'Другой ответ на основной',
        timestamp: '22.05.22 в 23:00',
        likes: 0,
        dislikes: 0,
        level: 1,
        replies: [],
      },
    ],
  },
  {
    id: '2',
    author: 'Rum_8',
    email: 'rum8@example.com',
    homepage: 'https://rum8.dev',
    avatar: '👤',
    content: 'Второй основной комментарий',
    timestamp: '22.05.22 в 22:45',
    likes: 0,
    dislikes: 0,
    level: 0,
    replies: [
      {
        id: '2-1',
        author: 'Anonym',
        email: 'anonym@example.com',
        avatar: '👤',
        content: 'Ответ на второй комментарий',
        timestamp: '22.05.22 в 23:00',
        likes: 0,
        dislikes: 0,
        level: 1,
        replies: [],
      },
    ],
  },
  {
    id: '3',
    author: 'Guest',
    email: 'guest@example.com',
    avatar: '👤',
    content: 'Третий основной комментарий без ответов',
    timestamp: '23.05.22 в 09:00',
    likes: 0,
    dislikes: 0,
    level: 0,
    replies: [],
  },
  {
    id: '4',
    author: 'Developer',
    email: 'dev@example.com',
    homepage: 'https://developer.io',
    avatar: '👤',
    content: 'Комментарий от разработчика',
    timestamp: '23.05.22 в 14:30',
    likes: 2,
    dislikes: 0,
    level: 0,
    replies: [],
  },
  {
    id: '5',
    author: 'Designer',
    email: 'design@example.com',
    homepage: 'https://designer.art',
    avatar: '👤',
    content: 'Комментарий от дизайнера',
    timestamp: '23.05.22 в 16:45',
    likes: 1,
    dislikes: 1,
    level: 0,
    replies: [],
  },
];

// Получаем только основные комментарии (level 0) для таблицы
export const getMainComments = (): Comment[] => {
  return mockComments.filter(comment => comment.level === 0);
};
