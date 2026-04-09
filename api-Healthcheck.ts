import { request } from '@playwright/test';

export default async function apiHealth() {
  const apiContext = await request.newContext();

  const response = await apiContext.get(
    'https://restful-booker.herokuapp.com/ping'
  );

  console.log('Health check status:', response.status());

  if (response.status() !== 201) {
    throw new Error('❌ API is DOWN');
  }

  console.log('✅ API is UP');
}
