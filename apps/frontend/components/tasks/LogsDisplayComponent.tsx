import { useEffect, useRef } from 'react';
import { ScrollArea } from '..';

interface LogsDisplayProps {
  logs: string[];
}

const LogsDisplay: React.FC<LogsDisplayProps> = ({ logs }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollAreaRef.current;
      const isScrolledToBottom = scrollHeight - clientHeight <= scrollTop + 50;
      if (isScrolledToBottom) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }
  }, [logs]);

  return (
    <ScrollArea
      className="h-[400px] w-full border rounded-md p-4 bg-secondary"
      ref={scrollAreaRef}
    >
      <div>
        {logs.map((log, index) => (
          <div
            key={index}
            className={`text-sm mb-1 ${
              log.includes('Error') ? 'text-red-500' : ''
            }`}
          >
            {log}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default LogsDisplay;
