import React, { useMemo } from 'react';
import { HTMLRendererProps } from './html-renderer.types';

export const HTMLRenderer: React.FC<HTMLRendererProps> = ({ content }) => {
  // Разрешенные HTML теги
  const allowedTags = {
    'a': (props: any, children: any) => (
      <a 
        href={props.href} 
        title={props.title} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ color: '#3b82f6', textDecoration: 'underline' }}
      >
        {children}
      </a>
    ),
    'code': (props: any, children: any) => (
      <code style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '2px 4px', 
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '0.9em'
      }}>
        {children}
      </code>
    ),
    'i': (props: any, children: any) => (
      <i style={{ fontStyle: 'italic' }}>{children}</i>
    ),
    'strong': (props: any, children: any) => (
      <strong style={{ fontWeight: 'bold' }}>{children}</strong>
    ),
  };

  // Мемоизируем парсинг HTML для оптимизации производительности
  const parsedContent = useMemo(() => {
    // Простой парсер для разрешенных тегов
    const parseHTML = (text: string) => {
      const tagRegex = /<(\/?)(a|code|i|strong)([^>]*)>(.*?)<\/\2>/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = tagRegex.exec(text)) !== null) {
        const [fullMatch, isClosing, tagName, attributes, content] = match;
        
        if (isClosing) continue; // Пропускаем закрывающие теги
        
        // Добавляем текст до тега
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }

        // Парсим атрибуты для тега <a>
        let props: any = {};
        if (tagName === 'a') {
          const hrefMatch = attributes.match(/href="([^"]*)"/);
          const titleMatch = attributes.match(/title="([^"]*)"/);
          if (hrefMatch) props.href = hrefMatch[1];
          if (titleMatch) props.title = titleMatch[1];
        }

        // Рендерим тег
        const TagComponent = allowedTags[tagName as keyof typeof allowedTags];
        if (TagComponent) {
          parts.push(TagComponent(props, content));
        } else {
          parts.push(content); // Если тег не разрешен, показываем только содержимое
        }

        lastIndex = match.index + fullMatch.length;
      }

      // Добавляем оставшийся текст
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }

      return parts.length > 0 ? parts : [text];
    };

    return parseHTML(content);
  }, [content]);

  return <>{parsedContent}</>;
};
