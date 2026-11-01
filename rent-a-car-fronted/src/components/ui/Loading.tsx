import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

const Loading = ({ text, fullScreen = false }: LoadingProps) => {
  const { t } = useTranslation();
  const label = text ?? t('common.loading');

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
          <p className="text-lg text-gray-400">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
        <p className="text-gray-400">{label}</p>
      </div>
    </div>
  );
};

export default Loading;
