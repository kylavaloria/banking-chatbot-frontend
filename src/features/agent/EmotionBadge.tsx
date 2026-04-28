interface EmotionBadgeProps {
  label?:     string | null;
  intensity?: string | null;
}

interface EmotionStyle {
  emoji: string;
  badge: string;
}

const EMOTION_STYLES: Record<string, EmotionStyle> = {
  angry:      { emoji: '😤', badge: 'bg-red-100 text-red-700 border-red-200'     },
  frustrated: { emoji: '😒', badge: 'bg-orange-100 text-orange-700 border-orange-200' },
  anxious:    { emoji: '😰', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  distressed: { emoji: '😢', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
  neutral:    { emoji: '😐', badge: 'bg-gray-100 text-gray-500 border-gray-200'   },
};

const INTENSITY_DOT: Record<string, string> = {
  high:   'bg-red-500',
  medium: 'bg-yellow-500',
  low:    'bg-green-500',
};

export function EmotionBadge({ label, intensity }: EmotionBadgeProps) {
  if (!label) return null;

  const key    = label.toLowerCase();
  const style  = EMOTION_STYLES[key];
  if (!style) return null;

  const displayLabel = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  const dotClass     = intensity ? INTENSITY_DOT[intensity.toLowerCase()] : null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${style.badge}`}
    >
      {style.emoji} {displayLabel}
      {dotClass && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotClass}`}
          title={`${intensity!.charAt(0).toUpperCase()}${intensity!.slice(1)} intensity`}
        />
      )}
    </span>
  );
}
