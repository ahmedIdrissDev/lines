import { Employee } from "@/types";
import {
  ArrowDown,
  ArrowUp,
  ChartNoAxesColumn,
  ChartSpline,
  TrendingDown,
  TrendingUp,
  User2,
} from "lucide-react";
interface customchartProps {
  siteManger: string;
  count: number;
  present: Employee[];
}
const Customchart = ({ count , present , siteManger }: customchartProps) => {
  const func = Object.groupBy(present, ({ function: fun }) => fun);
  const Absent = present.filter((items) => items.status === "inactive");

  const data = Object.entries(func).map(([func, data]) => ({
    func,
    count: data?.filter(({ status }) => status === "active").length,
    countabsent: data?.filter(({ status }) => status === "inactive").length,
  }));

  return (
    <div
      className={`w-full flex rounded-md cursor-pointer duration-150 hover:border-primary flex-col gap-1.5 border border-hairline bg-surface-card p-4 h-full shadow-sm hover:shadow-md transition-all`}
    >
      <div className="w-full rounded-md flex items-center px-4 bg-surface-bone h-10 mb-2">
        <h1 className="heading-sm">{siteManger ? siteManger : "Project"}</h1>
      </div>
      <div className="w-full items-center h-30 border border-hairline rounded-md flex justify-center gap-3 bg-canvas">
        <ChartNoAxesColumn className="text-primary" />
        <p className="display-md">{count}</p>
      </div>
      <div className="w-full grid grid-cols-2 gap-2 mt-2">
        <div className="rounded-full flex justify-center items-center w-full bg-badge-success text-on-dark gap-2 h-9 caption-tight">
          <TrendingUp size={16} />
          {present.length - Absent.length}
        </div>
        <div className="rounded-full gap-2 flex justify-center border border-hairline-strong items-center w-full text-ink h-9 caption-tight">
          <TrendingDown size={16} />
          {Absent.length}
        </div>
      </div>
      <div className="w-full h-full flex flex-col gap-2 p-2 mt-2 rounded-md border border-hairline">
        {data.map(({ count, func, countabsent }, index) => (
          <div key={index} className="grid w-full grid-cols-[1fr_40px_40px] gap-2 items-center py-1 border-b border-hairline last:border-0">
            <span className="body-sm text-charcoal truncate">{func}</span>
            <span className="w-10 h-10 flex justify-center items-center bg-primary/10 text-primary font-bold rounded-md">
              {count}
            </span>
            <span className="w-10 h-10 flex justify-center items-center bg-surface-dark text-on-dark font-bold rounded-md">
              {countabsent}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customchart;
