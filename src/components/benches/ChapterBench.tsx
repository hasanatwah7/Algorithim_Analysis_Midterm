import { InductionBench } from "@/components/benches/InductionBench";
import { PrimitiveOpsBench } from "@/components/benches/PrimitiveOpsBench";
import { GrowthBench } from "@/components/benches/GrowthBench";
import { RecurrenceBench } from "@/components/benches/RecurrenceBench";
import { PartitionBench } from "@/components/benches/PartitionBench";
import { HeapBench } from "@/components/benches/HeapBench";

export function ChapterBench({ chapter }: { chapter: number }) {
  switch (chapter) {
    case 1:
      return <InductionBench />;
    case 2:
      return <PrimitiveOpsBench />;
    case 3:
      return <GrowthBench />;
    case 4:
      return <RecurrenceBench />;
    case 5:
      return <PartitionBench />;
    case 6:
      return <HeapBench />;
    default:
      return null;
  }
}
