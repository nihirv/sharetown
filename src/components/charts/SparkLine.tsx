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
  options: string[];
}

export default function SparkLine({ proposalId, options }: Props) {
  const { bets } = useBets(proposalId, options);
  const [history, setHistory] = useState<Record<string, number[]>>(() =>
    options.reduce((acc, option) => ({ ...acc, [option]: [] }), {})
  );

  // Update history when new bets come in
  useEffect(() => {
    if (bets.length === 0) return;

    // Calculate running percentages
    const runningHistory = bets.reduce(
      (acc: Record<string, number[]>, _bet: Bet, i: number, arr: Bet[]) => {
        const currentSlice = arr.slice(0, i + 1);
        const total = currentSlice.reduce((sum, b) => sum + b.stake, 0);

        // Calculate percentage for each outcome
        options.forEach((outcome) => {
          const outcomeTotal = currentSlice
            .filter((b) => b.outcome === outcome)
            .reduce((sum, b) => sum + b.stake, 0);
          const pct = total ? outcomeTotal / total : 0;
          acc[outcome] = [...(acc[outcome] || []), pct];
        });

        return acc;
      },
      options.reduce((acc, option) => ({ ...acc, [option]: [] }), {})
    );

    setHistory(runningHistory);
  }, [bets, options]);

  // Default to 20 data points
  const defaultPoints = 20;
  const labels = [
    ...Array(
      Math.max(
        defaultPoints,
        options.length > 0 ? history[options[0]]?.length || 0 : 0
      )
    ).keys(),
  ];

  // For empty state, create flat lines at equal percentages
  const emptyData = labels.map(() => 1 / Math.max(1, options.length));

  const colors = [
    "rgb(167, 243, 208)", // emerald-200
    "rgb(199, 210, 254)", // indigo-200
    "rgb(254, 202, 202)", // red-200
    "rgb(186, 230, 253)", // sky-200
  ];

  const data = {
    labels,
    datasets: options.map((option, index) => ({
      data: history[option]?.length ? history[option] : emptyData,
      borderWidth: 1.5,
      tension: 0.3,
      borderColor: colors[index % colors.length],
      pointRadius: 0, // Remove points
    })),
  };

  const graphOptions = {
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

  return (
    <Line id={proposalId} data={data} options={graphOptions} height={40} />
  );
}
