const { spawn } = require('child_process');

async function testAPI() {
    const baseUrl = 'http://localhost:3000/api';

    // 1. Create Category
    console.log('Creating Category...');
    const catRes = await fetch(`${baseUrl}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `TestCat_${Date.now()}` })
    });

    if (!catRes.ok) {
        console.error('Category creation failed:', await catRes.text());
        return;
    }

    const category = await catRes.json();
    console.log('Category created:', category._id);

    // 2. Create Item
    console.log('Creating Item...');
    const itemRes = await fetch(`${baseUrl}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Test Item',
            category: category._id,
            materialType: 'Fabric',
            quantity: 10,
            unit: 'm',
            color: 'Blue'
        })
    });

    if (!itemRes.ok) {
        console.error('Item creation failed:', await itemRes.text());
        return;
    }

    const item = await itemRes.json();
    console.log('Item created successfully:', item._id);
}

testAPI().catch(console.error);
