import { runPythonCode } from '@/ai/flows/run-python-code';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const result = await runPythonCode({ code });

    return NextResponse.json({ output: result.output });
  } catch (error) {
    console.error('Error running code:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to run code', details: message },
      { status: 500 }
    );
  }
}
