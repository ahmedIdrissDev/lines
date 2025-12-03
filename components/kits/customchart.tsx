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
      className={`'w-full flex rounded-md cursor-pointer duration-150 hover:border-tgcc-400 flex-col gap-1.5 border border-neutral-200  bg-white p-2 h-full  `}
    >
      <div className="w-full rounded-md flex items-center px-2 bg-tgcc-300/5 h-10">
        <h1 className="font-semibold">{siteManger ? siteManger : "Project"} </h1>
      </div>
      <div className="w-full items-center h-30 border border-neutral-200 rounded-md flex justify-center">
        <ChartNoAxesColumn />
        <p className="text-2xl">{count} </p>
      </div>
      <div className="w-full grid grid-cols-2 gap-2 h-10">
        <div className=" rounded-md flex justify-center items-center w-full bg-tgcc-200/50 text-tgcc-700 gap-2 h-full">
          <TrendingUp />
          {present.length - Absent.length} Présence
        </div>
        <div className=" rounded-md  gap-2 flex justify-center border border-neutral-200 items-center w-full text-tgcc-950 h-full">
          <TrendingDown />
          {Absent.length} Absence
        </div>
      </div>
      <div className="w-full h-full flex flex-col gap-2 p-2 rounded-md border border-neutral-200">
        {data.map(({ count, func, countabsent }, index) => (
          <div key={index} className="grid w-full grid-cols-3 gap-1.5">
            {func}
            <span className="w-full flex justify-center items-center h-10 bg-amber-300/5  rounded-2xl">
              {count}
            </span>
            <span className="w-full flex justify-center items-center h-10 bg-red-50 text-red-700  rounded-2xl">
              {countabsent}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customchart;
