/**
 * Downloads the resume PDF through `POST /api/resume` and saves it.
 *
 * @returns Resolves when the browser download has started.
 * @throws {Error} When the endpoint responds with a non-2xx status.
 */
export async function downloadResume(): Promise<void> {
  const res = await fetch('/api/resume', {
    method: 'POST',
    headers: { 'X-Resume-Request': '1' },
  });
  if (!res.ok) throw new Error(`Resume download failed (${res.status})`);

  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Rajkumar_Neupane_Resume.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a moment to start the download before freeing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
