export interface Comment {
  id: string;
  author: string;
  email: string;
  homepage?: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies: Comment[];
  level: number;
}

// Генератор случайных данных
const generateRandomComment = (
  id: string,
  level: number = 0,
  parentAuthor?: string
): Comment => {
  const authors = [
    'Anonym',
    'Rum_8',
    'User123',
    'Admin',
    'Moderator',
    'Guest',
    'Developer',
    'Designer',
    'Blogger',
    'Tester',
    'Manager',
    'Writer',
    'Artist',
    'Coder',
    'Reviewer',
    'Expert',
    'Newbie',
    'Pro',
    'Master',
    'Student',
  ];
  const avatars = [
    '👤',
    '🧑‍💻',
    '👩‍💻',
    '🧑‍🎨',
    '👩‍🎨',
    '🧑‍💼',
    '👩‍💼',
    '🧑‍🔬',
    '👩‍🔬',
    '🧑‍🎓',
    '👩‍🎓',
    '🤖',
    '👻',
    '🎭',
    '🎪',
    '🎨',
    '🎯',
    '🎲',
    '🎸',
    '🎺',
  ];
  const homepages = [
    'supersavka',
    'myprofile',
    'portfolio',
    'blog',
    'projects',
    'about',
    'contact',
    'gallery',
    'resume',
    'skills',
  ];
  const domains = [
    'example.com',
    'test.org',
    'demo.net',
    'sample.io',
    'mock.dev',
    'fake.co',
    'temp.biz',
    'random.info',
  ];

  const author = authors[Math.floor(Math.random() * authors.length)];
  const avatar = avatars[Math.floor(Math.random() * avatars.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];

  const contents = [
    'Отличный комментарий!',
    'Согласен с автором',
    'Интересная точка зрения',
    'Спасибо за информацию',
    'Хорошая работа!',
    'Можно добавить еще детали',
    'Очень полезно',
    'Не совсем понятно',
    'Круто сделано!',
    'Нужно доработать',
    'Отлично объяснено',
    'Есть вопросы по теме',
    'Поддерживаю идею',
    'Классный подход!',
    'Можно улучшить',
    parentAuthor
      ? `@${parentAuthor} хороший комментарий!`
      : 'Первый комментарий в теме',
    parentAuthor
      ? `Отвечаю на комментарий ${parentAuthor}`
      : 'Начинаю новую дискуссию',
    'Добавлю свои мысли по теме',
    'Интересное обсуждение получается',
    'Вот мое мнение по вопросу',
  ];

  const content = contents[Math.floor(Math.random() * contents.length)];

  // Генерируем случайную дату в последние 30 дней
  const now = new Date();
  const randomDays = Math.floor(Math.random() * 30);
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  const commentDate = new Date(
    now.getTime() -
      randomDays * 24 * 60 * 60 * 1000 -
      randomHours * 60 * 60 * 1000 -
      randomMinutes * 60 * 1000
  );

  const timestamp = commentDate.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    id,
    author,
    email: `${author.toLowerCase()}@${domain}`,
    homepage:
      level === 0 && Math.random() > 0.7
        ? homepages[Math.floor(Math.random() * homepages.length)]
        : undefined,
    avatar,
    content,
    timestamp,
    level,
    replies: [],
  };
};

// Генерируем вложенные комментарии
const generateReplies = (
  parentId: string,
  parentAuthor: string,
  level: number,
  maxReplies: number
): Comment[] => {
  if (level >= 4 || maxReplies <= 0) return [];

  const numReplies =
    Math.floor(Math.random() * Math.min(maxReplies, level === 0 ? 5 : 3)) +
    (level === 0 ? 1 : 0);
  const replies: Comment[] = [];

  for (let i = 0; i < numReplies; i++) {
    const replyId = `${parentId}-${i + 1}`;
    const reply = generateRandomComment(replyId, level + 1, parentAuthor);

    // Рекурсивно добавляем ответы к ответам
    reply.replies = generateReplies(
      replyId,
      reply.author,
      level + 1,
      maxReplies - 1
    );
    replies.push(reply);
  }

  return replies;
};

// Генерируем 100 основных комментариев
const generateMockComments = (): Comment[] => {
  const comments: Comment[] = [];

  for (let i = 1; i <= 100; i++) {
    const comment = generateRandomComment(i.toString(), 0);

    // Добавляем случайные ответы (не все комментарии имеют ответы)
    if (Math.random() > 0.3) {
      comment.replies = generateReplies(
        comment.id,
        comment.author,
        0,
        Math.floor(Math.random() * 8) + 1
      );
    }

    comments.push(comment);
  }

  return comments;
};

export const mockComments: Comment[] = generateMockComments();

// Получаем только основные комментарии (level 0) для таблицы
export const getMainComments = (): Comment[] => {
  return mockComments.filter((comment) => comment.level === 0);
};
