interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorMessage = ({
  message,
  onRetry,
  retryText = "다시 시도",
}: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-red-600 mb-4">⚠️ {message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {retryText}
        </button>
      )}
    </div>
  );
};
