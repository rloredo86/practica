import { NextResponse } from 'next/server';
import { supabase } from '@repo/database';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items } = body; // Expects an array of items: { id, quantity, price }

        // Call the RPC function 'checkout_cart'
        const { data: saleId, error } = await supabase.rpc('checkout_cart', {
            items: items
        });

        if (error) {
            console.error('RPC Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ saleId: saleId, message: 'Sale completed successfully' }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

export async function GET() {
    const { data, error } = await supabase
        .from('sales')
        .select('*, sale_items(*, products(name))')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
