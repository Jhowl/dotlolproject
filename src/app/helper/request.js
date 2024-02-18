export default function requestGet(url, params) {
  const urlParams = new URLSearchParams(params).toString();
  return fetch(`${url}?${urlParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}
