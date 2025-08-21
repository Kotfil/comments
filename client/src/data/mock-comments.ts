export interface Comment {
  id: string;
  author: string;
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
    avatar: '👤',
    content: 'Третий основной комментарий без ответов',
    timestamp: '23.05.22 в 09:00',
    likes: 0,
    dislikes: 0,
    level: 0,
    replies: [],
  },
];
