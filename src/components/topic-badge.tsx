import { Badge } from './ui/badge';

export default function TopicBadge({ label }: { label: string }) {
  return <Badge variant="outline">{label}</Badge>;
}
