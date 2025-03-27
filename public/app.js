async function fetchData() {
    const response = await fetch('http://localhost:8000/data');
    const json = await response.json();
    return json.data;
  }
  
  async function renderCharts() {
    const data = await fetchData();
  
    // Prepare data clearly
    const timestamps = data.map(d => new Date(d.timestamp).toLocaleTimeString());
    const weights = data.map(d => d.weight);
    const humidities = data.map(d => d.humidity);
    const fullness = data[data.length - 1].fullness;
    const ph = data[data.length - 1].pH;
  
    // Weight Line Chart
    new Chart(document.getElementById('weightChart'), {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [{ label: 'Weight (lbs)', data: weights, borderWidth: 2, borderColor: '#4caf50' }]
      }
    });
  
    // Humidity Bar Chart
    new Chart(document.getElementById('humidityChart'), {
      type: 'bar',
      data: {
        labels: timestamps,
        datasets: [{ label: 'Humidity (%)', data: humidities, backgroundColor: '#42a5f5' }]
      }
    });
  
    // Fullness Gauge
    document.getElementById('fullnessGauge').value = fullness;
    document.getElementById('fullnessValue').innerText = `${fullness}%`;
  
    // pH Level
    document.getElementById('phValue').innerText = ph;
  }
  
  // Refresh data every 10 seconds clearly
  renderCharts();
  setInterval(renderCharts, 10000);
  