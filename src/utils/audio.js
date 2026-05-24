/**
 * Synthesizes a premium "ding-dong" double-tone chime using the browser's native Web Audio API.
 * Requires no external audio file requests, ensuring instant load times and reliable offline playback.
 */
export function playNewOrderChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // ------------------------------------
    // First Tone ("Ding") - High pitch D5
    // ------------------------------------
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.5);

    // ------------------------------------
    // Second Tone ("Dong") - Low pitch A4 (Starts at 0.12s)
    // ------------------------------------
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(440.00, ctx.currentTime + 0.12); // A4
    
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.8);
  } catch (error) {
    console.warn("Unable to play Web Audio chime (user interaction might be required first):", error);
  }
}
