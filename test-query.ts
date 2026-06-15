import handler from './api/query.ts';

const req = {
  method: 'POST',
  body: {
    message: 'hi',
    history: []
  }
};

const res = {
  status: (code: number) => {
    console.log('Status:', code);
    return res;
  },
  json: (data: any) => {
    console.log('Response:', JSON.stringify(data, null, 2));
  }
};

async function test() {
  try {
    await handler(req, res);
  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

test();
