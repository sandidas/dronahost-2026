import { Skeleton } from "../ui/skeleton";

interface IProps {
  height?: number;
  isLoading?: boolean;
  column?: number; // Number of columns per row
  total?: number; // Total number of skeletons
}

const SkeltonLoader = ({ height = 600, isLoading = true, column = 1, total = 1 }: IProps) => {
  if (!isLoading) return null;

  return (
    <div className={`grid gap-5 ${column === 1 ? "grid-cols-1" : column === 2 ? "grid-cols-2" : column === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
      {Array.from({ length: total }).map((_, i) => (
        <Skeleton key={i} style={{ height: `${height}px` }} className="w-full rounded-xl animate-pulse" />
      ))}
    </div>
  );
};

export default SkeltonLoader;
