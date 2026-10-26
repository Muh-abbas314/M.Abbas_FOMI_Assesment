import Segmented from '@/components/ui/Segmented';
import { STYLES } from '@/lib/generation-options';

const STYLE_OPTIONS = STYLES.map((style) => ({ value: style, label: style }));

export default function StylePicker({ value, onChange }) {
  return <Segmented variant="chips" label="Style" options={STYLE_OPTIONS} value={value} onChange={onChange} />;
}
