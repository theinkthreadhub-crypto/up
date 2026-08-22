import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const apiKey = body.apiKey || process.env.QIKINK_API_KEY || '18edc332f4f51381dcc9d41012cdeb9eb3bb43bec5e0b2730b17b5bf6d732196';

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'API Key is missing' }, { status: 400 });
    }

    // Ping Qikink API to check authorization
    const response = await fetch('https://api.qikink.com/api/orders?limit=1', {
      method: 'GET',
      headers: {
        'ApiKey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    // Even if limit=1 returns 200 or 401/403, we inspect status
    if (response.status === 401 || response.status === 403) {
      return NextResponse.json({
        success: false,
        error: 'Invalid Qikink API Key or unauthorized access. Check API key in Qikink dashboard.',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Qikink API Key is active & connected successfully!',
      status: response.status,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Connection test failed';
    return NextResponse.json({ success: false, error: errorMsg });
  }
}
