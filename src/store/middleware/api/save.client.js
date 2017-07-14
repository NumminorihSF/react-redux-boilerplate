const a = document.createElement('a');
document.body.appendChild(a);
a.style.display = 'none';

function getFileName(response) {
  const header = response.headers['content-disposition'];
  if (!header) return null;
  const matches = header.match(new RegExp('(?:^|; )filename="([^;]*)"'));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export default function (response) {
  if (!response || !response.xhr || !(response.xhr.response instanceof Blob)) return;

  const blobUrl = window.URL.createObjectURL(response.xhr.response);
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 0);
  const fileName = getFileName(response);
  a.href = blobUrl;
  a.download = fileName || 'download';
  a.click();
}
