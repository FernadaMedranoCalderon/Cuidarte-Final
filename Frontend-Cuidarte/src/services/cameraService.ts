export async function captureEvidencePhoto() {
  return {
    uri: 'photo-simulated',
    capturedAt: new Date().toISOString(),
  };
}
