import Chart from "react-apexcharts";
import { useState } from "react";

export default function ChartBar() {
  const [state, setState] = useState({
    options: {
      chart: {
        id: "basic-bar",
        toolbar: {
          show: false // Hides the toolbar
        }
      },
      xaxis: {
        categories: ["1-10 Aug", "10-20 Aug", "21-30 Aug"],
        labels: {
          style: {
            fontSize: "14px", // Adjust font size
            fontFamily: "Arial, sans-serif" // Adjust font family
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 5, // Round the bars
          colors: {
            ranges: [
              {
                from: 0,
                to: 33,
                color: "#EBB064" // Custom color for the first range
              },
              {
                from: 34,
                to: 66,
                color: "#EBB064" // Custom color for the second range
              },
              {
                from: 67,
                to: 100,
                color: "#EBB064" // Custom color for the third range
              }
            ]
          }
        }
      },
      yaxis: {
        show: false // Hides the y-axis
      }
    },
    series: [
      {
        name: "Lessons Taught",
        data: [25, 38, 50]
      }
    ]
  });

  return (
    <Chart
      options={state.options}
      series={state.series}
      width="100%"
      type="bar"
    />
  );
}
