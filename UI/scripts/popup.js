// Analysis stages
const STAGES = [
    { text: "Initializing analysis...", duration: 1500 },
    { text: "Collecting reviews...", duration: 2000 },
    { text: "Processing sentiment...", duration: 2500 },
    { text: "Generating insights...", duration: 1500 },
    { text: "Finalizing results...", duration: 1000 }
  ];
  
  document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze');
    const clearBtn = document.getElementById('clear');
    const loader = document.getElementById('loader');
    const results = document.getElementById('results');
    const urlInput = document.getElementById('urlInput');
    
    // Dummy URL for demo
    urlInput.value = window.location.href;
  
    async function runAnalysis() {
      try {
        // Disable buttons during analysis
        analyzeBtn.disabled = true;
        clearBtn.disabled = true;
        analyzeBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analyzing...
        `;
        
        // Show loader
        loader.classList.remove('hidden');
        results.classList.add('hidden');
  
        // Run through analysis stages
        for (const stage of STAGES) {
          document.querySelector('#loader .text-gray-600').textContent = stage.text;
          await new Promise(resolve => setTimeout(resolve, stage.duration));
        }
  
        // Dummy results
        document.getElementById('sentimentScore').textContent = '8.5';
        document.getElementById('reviewCount').textContent = '127';
        
        const insights = [
          "85% positive sentiment across all reviews",
          "Most mentioned feature: Product quality",
          "Common praise: Fast shipping",
          "Areas for improvement: Customer service"
        ];
  
        const insightsList = document.getElementById('insightsList');
        insightsList.innerHTML = insights.map(insight => `
          <li class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>${insight}</span>
          </li>
        `).join('');
  
        // Show results
        loader.classList.add('hidden');
        results.classList.remove('hidden');
        
      } finally {
        // Re-enable buttons
        analyzeBtn.disabled = false;
        clearBtn.disabled = false;
        analyzeBtn.textContent = 'Analyze Reviews';
      }
    }
  
    // Event Listeners
    analyzeBtn.addEventListener('click', runAnalysis);
    
    clearBtn.addEventListener('click', () => {
      results.classList.add('hidden');
      document.getElementById('sentimentScore').textContent = '0';
      document.getElementById('reviewCount').textContent = '0';
      document.getElementById('insightsList').innerHTML = '';
    });
  
    // Copy URL functionality
    document.getElementById('copyUrl').addEventListener('click', () => {
      navigator.clipboard.writeText(urlInput.value);
      const button = document.getElementById('copyUrl');
      button.classList.add('text-green-600');
      setTimeout(() => button.classList.remove('text-green-600'), 1000);
    });
  });