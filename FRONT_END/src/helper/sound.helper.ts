
function playNote(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
    peakGain = 0.3
) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}


export function playCorrectSound() {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    playNote(ctx, 523, t, 0.18);
    playNote(ctx, 659, t + 0.15, 0.25);
}


export function playWrongSound() {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    playNote(ctx, 349, t, 0.15, 0.25);
    playNote(ctx, 294, t + 0.12, 0.2, 0.2);
}
