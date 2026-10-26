import Select from '@/components/ui/Select';
import {
  CAMERA_MOTIONS,
  IMAGE_ASPECTS,
  IMAGE_COUNTS,
  IMAGE_MODELS,
  VIDEO_ASPECTS,
  VIDEO_DURATIONS,
  VIDEO_MODELS,
} from '@/lib/generation-options';

const asOptions = (values, label = (v) => String(v)) => values.map((value) => ({ value, label: label(value) }));

const COUNT_OPTIONS = asOptions(IMAGE_COUNTS, (n) => (n === 1 ? '1 image' : `${n} images`));
const IMAGE_ASPECT_OPTIONS = asOptions(IMAGE_ASPECTS);
const VIDEO_ASPECT_OPTIONS = asOptions(VIDEO_ASPECTS);
const DURATION_OPTIONS = asOptions(VIDEO_DURATIONS, (d) => `${d}s`);
const CAMERA_OPTIONS = asOptions(CAMERA_MOTIONS);

/** The row of compact pill selects under the prompt. Video swaps "how many" for "how long" and adds camera motion. */
export default function ComposerSettings({ mode, settings, onChange, className }) {
  const set = (key) => (value) => onChange(key, value);
  return (
    <div className={className ?? 'flex flex-wrap gap-1.5'}>
      {mode === 'image' ? (
        <Select label="Images" value={settings.count} options={COUNT_OPTIONS} onChange={set('count')} />
      ) : (
        <Select label="Duration" value={settings.durationSec} options={DURATION_OPTIONS} onChange={set('durationSec')} />
      )}
      <Select
        label="Aspect ratio"
        value={settings.aspectRatio}
        options={mode === 'image' ? IMAGE_ASPECT_OPTIONS : VIDEO_ASPECT_OPTIONS}
        onChange={set('aspectRatio')}
      />
      <Select label="Model" value={settings.model} options={mode === 'image' ? IMAGE_MODELS : VIDEO_MODELS} onChange={set('model')} />
      {mode === 'video' && <Select label="Camera" value={settings.camera} options={CAMERA_OPTIONS} onChange={set('camera')} />}
    </div>
  );
}
