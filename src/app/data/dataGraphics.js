export const pieChartOptions = {
    labels: ["O'neil", "Duke", "Legacy", "Brigitta"],
    colors: ["#4fd272", "#1b3bbb", "#4318ff", "#6ad2ff"],
    chart: {
      width: "50px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: true,
          },
        },
      },
    },
    fill: {
      colors: ["#4fd272", "#1b3bbb", "#4318ff", "#6ad2ff"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: undefined,
        backgroundColor: "#000000"
      },
    },
  };
  
  export const pieChartData = [16, 11, 63, 10];




//Data grafico Humedad y temperatura
export const lineChartDataTotalSpent = [
    {
      name: "Humedad",
      data: [50, 64, 48, 26, 11, 78, 88, 130, 33],
      color: "#4fd273",
    },
    {
      name: "Temperatura",
      data: [30, 40, 24, 46, 20, 46, 30, 37, 28],
      color: "#0d489b",
    },
  ];
  
  export const lineChartOptionsTotalSpent = {
    legend: {
      show: false,
    },
  
    theme: {
      mode: "light",
    },
    chart: {
      type: "line",
      height:800,
      toolbar: {
        show: false,
      },
    },
  
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
  
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
        backgroundColor: "#000000"
      },
      theme: 'dark',
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    grid: {
      show: true,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
      type: "text",
      range: undefined,
      categories: ["20-12", "21-12", "22-12", "23-12", "24-12", "25-12", "26-12", "27-12", "28-12"],
    },
  
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
        offsetY: 10,
      },
      type: "numeric",
      range: undefined,
      //categories: ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"],
    },
  
    
  
  
  
  };