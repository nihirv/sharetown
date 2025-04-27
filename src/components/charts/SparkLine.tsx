import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bet, useBets } from "@/hooks/useBets";
import { useEffect, useState } from "react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Tooltip,
  Legend
);

interface Props {
  proposalId: string;
}

export default function SparkLine({ proposalId }: Props) {
  const { bets } = useBets(proposalId);
  const [history, setHistory] = useState<{
    garbage: number[];
    potholes: number[];
  }>({
    garbage: [],
    potholes: [],
  });

  // Update history when new bets come in
  useEffect(() => {
    if (bets.length === 0) return;

    // Calculate running percentages
    const runningHistory = bets.reduce(
      (
        acc: { garbage: number[]; potholes: number[] },
        _bet: Bet,
        i: number,
        arr: Bet[]
      ) => {
        const currentSlice = arr.slice(0, i + 1);
        const garbageTotal = currentSlice
          .filter((b) => b.outcome === "garbage")
          .reduce((sum, b) => sum + b.stake, 0);
        const total = currentSlice.reduce((sum, b) => sum + b.stake, 0);
        const garbagePct = total ? garbageTotal / total : 0;
        const potholesPct = total ? 1 - garbagePct : 0;

        return {
          garbage: [...acc.garbage, garbagePct],
          potholes: [...acc.potholes, potholesPct],
        };
      },
      { garbage: [], potholes: [] }
    );

    setHistory(runningHistory);
  }, [bets]);

  // Default to 20 data points
  const defaultPoints = 20;
  const labels = [
    ...Array(Math.max(defaultPoints, history.garbage.length)).keys(),
  ];

  // For empty state, create flat lines at 50%
  const emptyData = labels.map(() => 0.5);

  const data = {
    labels,
    datasets: [
      {
        data: history.garbage.length ? history.garbage : emptyData,
        borderWidth: 1.5,
        tension: 0.3,
        borderColor: "rgb(167, 243, 208)", // emerald-200
        pointRadius: 0, // Remove points
      },
      {
        data: history.potholes.length ? history.potholes : emptyData,
        borderWidth: 1.5,
        tension: 0.3,
        borderColor: "rgb(199, 210, 254)", // indigo-200
        pointRadius: 0, // Remove points
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: {
        display: false,
        min: 0,
        max: 1,
      },
    },
  };

  return <Line id={proposalId} data={data} options={options} height={40} />;
}
