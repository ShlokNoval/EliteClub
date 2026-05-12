const testEmail = async () => {
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '5a6be629-c68b-4be3-8219-ef72802d972b',
        name: 'Test',
        email: 'test@test.com',
        message: 'Hello'
      })
    });
    const result = await response.text();
    console.log('Web3Forms Result Status:', response.status);
    console.log('Web3Forms Result Body:', result.substring(0, 500));
  } catch (err) {
    console.error('Error:', err);
  }
};
testEmail();
