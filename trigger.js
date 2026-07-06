import fetch from 'node-fetch';

// Change "quantum_sangha_circle_99x" to your own unique secret topic name
const TOPIC_NAME = "quantum_sangha_groupie";

async function checkQuantumQubit() {
  try {
    const response = await fetch('https://lfdr.de/qrng_api/qrng?length=1&format=HEX');
    const qdata = await response.json();
    const decimalValue = parseInt(qdata.qrn, 16);
    
    console.log(`[QRNG Matrix] Hex: ${qdata.qrn} | Decimal: ${decimalValue}`);

    // ~8.33% chance to hit (Expected value = 1 time per hour over 12 intervals)
    if (decimalValue <= 21) {
      console.log("✨ Quantum criteria matched! Striking the global gong...");

      // Broadcast to ntfy.sh
      await fetch(`https://ntfy.sh/${TOPIC_NAME}`, {
        method: 'POST',
        body: '🔔 The qubit has collapsed. Let\'s meditate together.',
        headers: { 'Title': 'Quantum Sangha' }
      });
      
      console.log("Broadcast successfully deployed.");
    } else {
      console.log("Criteria unfulfilled this interval.");
    }
  } catch (error) {
    console.error("Cron failed:", error);
  }
}

checkQuantumQubit();
