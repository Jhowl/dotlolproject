export default function requestGet(url, params) {
  console.log('url', params);
  const urlParams = new URLSearchParams(params).toString();
  console.log('urlParams', urlParams);
  return fetch(`${url}?${urlParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}
