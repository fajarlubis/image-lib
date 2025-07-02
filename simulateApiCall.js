const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNzUxNDk0ODc3IiwiaWF0IjoiMTc1MTQ1MTY3NyIsIm1lbnVzIjpbeyJpZCI6MTcsIm5hbWUiOiJEYXNoYm9hcmQiLCJjb2RlIjoiZGFzaGJvYXJkIiwidXJsIjoiLyIsInBhcmVudF9pZCI6MH0seyJpZCI6MTgsIm5hbWUiOiJNYXJrZXRpbmcgXHUwMDI2IFBSIiwiY29kZSI6Im1hcmtldGluZy1hbmQtcHIiLCJ1cmwiOiIvIiwicGFyZW50X2lkIjowfSx7ImlkIjo4LCJuYW1lIjoiQXJ0aWNsZSIsImNvZGUiOiJhcnRpY2xlIiwidXJsIjoiL2FkbWluL2FydGljbGVzIiwicGFyZW50X2lkIjoxOH0seyJpZCI6MjAsIm5hbWUiOiJCYW5uZXIiLCJjb2RlIjoiYmFubmVyIiwidXJsIjoiL2FkbWluL2Jhbm5lcnMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyMSwibmFtZSI6IlBvcC11cCIsImNvZGUiOiJwb3B1cCIsInVybCI6Ii9hZG1pbi9wb3B1cHMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyMiwibmFtZSI6IkFjdGl2aXR5IiwiY29kZSI6ImFjdGl2aXR5IiwidXJsIjoiL2FkbWluL2FjdGl2aXRpZXMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyMywibmFtZSI6IlRlc3RpbW9ueSIsImNvZGUiOiJ0ZXN0aW1vbnkiLCJ1cmwiOiIvYWRtaW4vdGVzdGltb25pZXMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyNCwibmFtZSI6IlByb21vdGlvbiIsImNvZGUiOiJwcm9tb3Rpb24iLCJ1cmwiOiIvYWRtaW4vcHJvbW90aW9ucyIsInBhcmVudF9pZCI6MTh9LHsiaWQiOjE5LCJuYW1lIjoiVXNlciBNYW5hZ2VtZW50IiwiY29kZSI6InVzZXItbWFuYWdlbWVudCIsInVybCI6Ii8iLCJwYXJlbnRfaWQiOjB9XSwibmFtZSI6IlN1cGVyIEFkbWluIiwidXVpZCI6ImJlOTU0YzhiLTA4ZjQtNDExNy1iNmI0LWIyYTY0ZmEwYWEwMCJ9.HbY_EI2AxyStMN0dOElznaN400JsKZLzF-QXdhuA_9M';

async function simulate() {
  const data = new FormData();
  const dummyContent = Buffer.from('dummy');
  const file = new File([dummyContent], 'dummy.jpg', { type: 'image/jpeg' });
  data.append('images[0][tablet-1024]', file);
  data.append('metadata[0]', JSON.stringify({ description: 'sample image' }));

  try {
    const res = await fetch('http://localhost:8800/cms/admin/fileupload/batch', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text);
  } catch (err) {
    console.error('Request failed:', err);
  }
}

simulate();
